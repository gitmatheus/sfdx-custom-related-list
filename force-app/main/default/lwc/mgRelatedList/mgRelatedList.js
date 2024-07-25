import { LightningElement, track, api, wire } from 'lwc';
import { NavigationMixin, CurrentPageReference } from 'lightning/navigation';
import MgRelatedListHelper from './mgRelatedListHelper';
import LightningConfirm from 'lightning/confirm';
import {
    deleteRecord,
    notifyRecordUpdateAvailable,
    getRecord,
    getFieldValue,
} from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';
import MgEditRecordModal from 'c/mgEditRecordModal';

import fetchRelatedListData from '@salesforce/apex/MgRelatedListController.fetchRelatedListData';
import fetchObjectFields from '@salesforce/apex/MgRelatedListController.fetchObjectFields';

export default class MgRelatedList extends NavigationMixin(
    LightningElement,
) {
    // Declare the helper
    helper = new MgRelatedListHelper();

    // Public API properties
    @api recordId;
    @api objectApiName;
    @api customActions = [];
    @api fromObjectApiName;
    @api relatedFieldApiName;
    @api sourceFieldApiName;

    // UX and UI options
    @api numberOfRecords = 6;
    @api orderBy;
    @api fields;
    @api iconName;
    @api showNewButton;
    @api showViewAll;

    // Tracked state
    @track state = {};

    // This property is dynamically populated from schema
    // based on the object name passed to fromObjectApiName
    @track columns = [];
    @track sourceFieldValue;

    // Wire the getRecord method to fetch the record data
    @wire(getRecord, { recordId: '$recordId', fields: '$recordFields' })
    wiredRecord({ error, data }) {
        if (data) {
            try {
                if (this.sourceFieldApiName?.toLowerCase() === 'id') {
                    this.sourceFieldValue = this.recordId;
                } else {
                    this.sourceFieldValue = getFieldValue(
                        data,
                        this.getRecordSourceFieldName(),
                    );
                }
                this.init();
            } catch (err) {
                this.showNotification('Error', JSON.stringify(err), 'error');
            }
        } else if (error) {
            this.showNotification('Error', JSON.stringify(error), 'error');
        }
    }

    // ========================================
    // FETCHER METHODS
    // ========================================

    // Fetches the related list data from Apex
    fetchData(state) {
        let jsonData = Object.assign({}, state);
        jsonData.numberOfRecords = state.numberOfRecords + 1;
        jsonData = JSON.stringify(jsonData);
        return fetchRelatedListData({ jsonData })
            .then((response) => {
                const data = JSON.parse(response);
                return this.helper.processData(data, state);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // Fetches the object fields data from Apex
    fetchFields(state) {
        let jsonData = Object.assign({}, state);
        jsonData = JSON.stringify(jsonData);
        return fetchObjectFields({ jsonData })
            .then((response) => {
                return JSON.parse(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // ========================================
    // callback METHODS
    // ========================================

    // Callback method when the component is inserted into the DOM
    connectedCallback() {
        this.state.recordId = this.recordId;
        this.state.objectApiName = this.objectApiName;
        this.state.sourceFieldApiName = this.sourceFieldApiName || 'Id';
        this.state.showRelatedList = this.recordId !== null;
        this.init();
    }
    // ========================================

    // Initialize the component
    async init() {
        if (
            !(
                this.recordId &&
                this.fromObjectApiName &&
                this.relatedFieldApiName &&
                this.fields
            )
        ) {
            this.state.records = [];
            return;
        }

        this.populateState();

        try {
            // Populates the fields from the helper that is invoking the apex method
            const fieldData = await this.fetchFields(this.state);
            if (!fieldData || fieldData.length <= 0) {
                this.showNoFieldsFoundErrorMessage();
                return;
            }

            // Map field data to columns
            this.columns = Object.keys(fieldData).map((key) => {
                const field = fieldData[key];
                return {
                    label: field.label,
                    fieldName: field.name,
                    type: field.type,
                    typeAttributes: field.typeAttributes,
                };
            });

            if (this.columns.length <= 0) {
                this.showNoFieldsFoundErrorMessage();
                return;
            }

            // Fetch related list data
            const data = await this.fetchData(this.state);

            // Add data to state
            this.addDataToState(data);
        } catch (error) {
            this.showNotification('Error', JSON.stringify(error), 'error');
        }
    }

    // =======================================
    // HANDLER METHODS
    // =======================================

    // Handler for the actions available on each row
    async handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        switch (actionName) {
            case 'delete':
                await this.handleDeleteRecord(row);
                break;
            case 'edit':
                await this.handleEditRecord(row);
                break;
            default:
        }
    }

    // Navigate to related list view
    handleGotoRelatedList() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: this.recordId,
                relationshipApiName: this.state.parentRelationshipApiName,
                actionName: 'view',
                objectApiName: this.fromObjectApiName,
            },
        });
    }

    // Handle creating a new record
    handleCreateRecord() {
        const defaultValues = encodeDefaultFieldValues({
            [this.state.relatedFieldApiName]: this.state.recordId,
        });

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.fromObjectApiName,
                actionName: 'new',
            },
            state: {
                defaultFieldValues: defaultValues,
            },
        }).then(() => {
            this.resetState();
        });
    }

    // Handle editing a record
    async handleEditRecord(row) {
        const result = await MgEditRecordModal.open({
            size: 'medium',
            header: 'Edit Record',
            recordId: row.Id,
            objectApiName: this.fromObjectApiName,
        });

        // undefined: the modal was closed with X button
        // cancel: the modal was closed with the cancel button
        // error: an error occurred
        // success: the record was successfully saved
        if (result === 'success') {
            this.resetState();
            this.refreshRecords();
        }
    }

    // Handle deleting a record
    async handleDeleteRecord(row) {
        const result = await LightningConfirm.open({
            message: `Are you sure you want to delete the ${this.state.sobjectLabel} "${row.Name}"?`,
            variant: 'header',
            label: 'Delete record',
        });
        if (result) {
            deleteRecord(row.Id)
                .then(() => {
                    this.showNotification(
                        'Success',
                        `${this.state.sobjectLabel} "${row.Name}" was deleted.`,
                        'success',
                    );
                    this.resetState();
                })
                .catch((error) => {
                    this.showNotification(
                        'Error',
                        `Error deleting record: ${JSON.stringify(error)}`,
                        'error',
                    );
                });
        }
    }

    // =======================================
    // HELPER METHODS
    // =======================================

    // Getter for the list of fields to use
    get recordFields() {
        const fields = [this.getRecordSourceFieldName()];
        return fields;
    }

    // Method used by the HTML to show or hide the data table
    get hasRecords() {
        return (
            this.state !== null &&
            this.state.records !== null &&
            this.state.records?.length
        );
    }

    // Get the source field name for the record.
    // Defaults to Id if not specified
    getRecordSourceFieldName() {
        const sourceFieldName = this.sourceFieldApiName || 'Id';
        const fullFieldName = `${this.objectApiName}.${sourceFieldName}`;
        return fullFieldName;
    }

    // Add data to state after fetching related list data
    addDataToState(data) {
        this.state.records = data.records;
        this.state.iconName = data.iconName;
        this.state.sobjectLabel = data.sobjectLabel;
        this.state.sobjectLabelPlural = data.sobjectLabelPlural;
        this.state.title = data.title;
        this.state.parentRelationshipApiName = data.parentRelationshipApiName;

        // Initialize columns with actions
        this.state.columns = this.helper.initColumnsWithActions(
            this.columns,
            this.customActions,
        );
    }

    // Populate the state with component data
    populateState() {
        this.state.fields = this.fields;
        this.state.relatedFieldApiName = this.relatedFieldApiName;
        this.state.sourceFieldApiName = this.sourceFieldApiName || 'Id';
        this.state.recordId = this.recordId;
        this.state.sourceFieldValue = this.sourceFieldValue;

        this.state.numberOfRecords = this.numberOfRecords;
        this.state.fromObjectApiName = this.fromObjectApiName;
        this.state.orderBy = this.orderBy;
        this.state.customActions = this.customActions;
        this.state.iconName = this.iconName;
    }

    // Convenience method used to reset the state after some change
    resetState() {
        this.init();
    }

    // Refreshes the record and notify that a record update is available
    async refreshRecords() {
        await notifyRecordUpdateAvailable([{ recordId: this.recordId }]);
    }

    // Convenience method to show a message for when fields were not found
    showNoFieldsFoundErrorMessage() {
        this.showNotification('Error', 'No valid fields found', 'error');
    }

    // Method that displays notifications
    showNotification(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(event);
    }
}
