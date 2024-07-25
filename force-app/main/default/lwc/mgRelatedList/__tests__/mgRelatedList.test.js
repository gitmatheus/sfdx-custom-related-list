import { createElement } from 'lwc';
import MgRelatedList from 'c/mgRelatedList';

describe('c-mgRelatedList', () => {
    afterEach(() => {
        // Clear the DOM to avoid test interference
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    async function flushPromises() {
        return Promise.resolve();
    }

    it('should instantiate the MgRelatedList component', () => {
        const element = createElement('c-mgRelatedList', {
            is: MgRelatedList,
        });

        document.body.appendChild(element);

        // Check if the component is instantiated and added to the DOM
        expect(element).toBeInstanceOf(HTMLElement);
        expect(element.tagName).toBe('C-MGRELATEDLIST');
    });

    it('should display the icon based on iconName property', async () => {
        const element = createElement('c-mgRelatedList', {
            is: MgRelatedList,
        });

        // Set necessary properties
        element.recordId = '001000000000000000';
        element.fromObjectApiName = 'Opportunity';
        element.relatedFieldApiName = 'AccountId';
        element.fields = 'Name, Industry';
        element.state = {
            iconName: 'utility:settings',
            showRelatedList: true,
            records: [{ Id: '001', Name: 'Record 1' }],
            columns: [{ label: 'Name', fieldName: 'name' }],
        };

        document.body.appendChild(element);

        // Wait for re-render
        await Promise.resolve();

        const iconElement = element.shadowRoot.querySelector('lightning-icon');
        expect(iconElement).not.toBeNull();
    });

    it('should not display the New button if showNewButton is false', async () => {
        const element = createElement('c-mgRelatedList', {
            is: MgRelatedList,
        });

        element.showNewButton = false;
        element.state = {
            showRelatedList: false,
        };

        document.body.appendChild(element);

        // Wait for re-render
        await flushPromises();

        const newButton = element.shadowRoot.querySelector(
            'lightning-button[label="New"]',
        );
        expect(newButton).toBeNull();
    });

    it('should display the correct title based on the state.title property', async () => {
        const element = createElement('c-mgRelatedList', {
            is: MgRelatedList,
        });

        // Set necessary properties
        element.recordId = '001000000000000000';
        element.fromObjectApiName = 'Opportunity';
        element.relatedFieldApiName = 'AccountId';
        element.fields = 'Name, Industry';
        element.state = {
            title: '',
            showRelatedList: true,
            records: [{ Id: '001', Name: 'Record 1' }],
            columns: [{ label: 'Name', fieldName: 'name' }],
        };

        document.body.appendChild(element);

        // Wait for re-render
        await flushPromises();

        const titleElement = element.shadowRoot.querySelector(
            '.slds-card__header-title a',
        );
        expect(titleElement).not.toBeNull();
        expect(titleElement.textContent).toBe('');
    });

    it('should not render lightning-datatable if there are no records', async () => {
        const element = createElement('c-mgRelatedList', {
            is: MgRelatedList,
        });

        // Set necessary properties
        element.recordId = '001000000000000000';
        element.fromObjectApiName = 'Opportunity';
        element.relatedFieldApiName = 'AccountId';
        element.fields = 'Name, Industry';
        element.state = {
            showRelatedList: true,
            columns: [{ label: 'Name', fieldName: 'name' }],
            records: [],
        };

        document.body.appendChild(element);

        // Wait for re-render
        await flushPromises();

        const dataTable = element.shadowRoot.querySelector(
            'lightning-datatable',
        );
        expect(dataTable).toBeNull();
    });
});
