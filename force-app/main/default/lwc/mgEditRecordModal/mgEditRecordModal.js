import { api, LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningModal from 'lightning/modal';

export default class MgEditRecordModal extends LightningModal {
    @api recordId;
    @api objectApiName;
    @api header;

    handleCancel() {
        this.close('cancel');
    }

    handleSuccess() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Record updated successfully!',
            variant: 'success',
        });
        this.dispatchEvent(evt);
        this.close('success');
    }

    handleError() {
        const evt = new ShowToastEvent({
            title: 'Error',
            message: 'An error occurred while updating the record.',
            variant: 'error',
        });
        this.dispatchEvent(evt);
        this.close('error');
    }
}
