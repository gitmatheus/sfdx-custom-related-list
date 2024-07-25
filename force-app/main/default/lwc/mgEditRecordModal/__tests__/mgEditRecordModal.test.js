/* eslint-disable jest/valid-title */
import { createElement } from 'lwc';
import mgEditRecordModal from 'c/mgEditRecordModal';
import { ShowToastEventName } from 'lightning/platformShowToastEvent';

const LIGHTNING_MODAL_HEADER = 'lightning-modal-header';
const COMPONENT_NAME = 'c-mg-edit-record-modal';

describe(COMPONENT_NAME, () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders the component and verifies initial state', () => {
        const element = createElement(COMPONENT_NAME, {
            is: mgEditRecordModal,
        });
        element.recordId = '003000000000000000';
        element.objectApiName = 'Contact';
        element.header = 'Edit Contact';

        // Act
        document.body.appendChild(element);

        // Assert
        const modalHeader = element.shadowRoot.querySelector(
            LIGHTNING_MODAL_HEADER,
        );
        const recordForm = element.shadowRoot.querySelector(
            'lightning-record-form',
        );

        expect(modalHeader).not.toBeNull();
        expect(modalHeader.label).toBe('Edit Contact');

        expect(recordForm).not.toBeNull();
        expect(recordForm.recordId).toBe('003000000000000000');
        expect(recordForm.objectApiName).toBe('Contact');
    });

    it('handles success event', () => {
        // Arrange
        const element = createElement(COMPONENT_NAME, {
            is: mgEditRecordModal,
        });
        document.body.appendChild(element);
        const handler = jest.fn();
        element.addEventListener(ShowToastEventName, handler);

        // Act
        const recordForm = element.shadowRoot.querySelector(
            'lightning-record-form',
        );
        recordForm.dispatchEvent(new CustomEvent('success'));

        // Assert
        expect(handler).toHaveBeenCalled();
        const toastEvent = handler.mock.calls[0][0];
        expect(toastEvent.detail.title).toBe('Success');
        expect(toastEvent.detail.message).toBe('Record updated successfully!');
        expect(toastEvent.detail.variant).toBe('success');
    });

    it('handles error event', () => {
        // Arrange
        const element = createElement(COMPONENT_NAME, {
            is: mgEditRecordModal,
        });
        document.body.appendChild(element);
        const handler = jest.fn();
        element.addEventListener(ShowToastEventName, handler);

        // Act
        const recordForm = element.shadowRoot.querySelector(
            'lightning-record-form',
        );
        recordForm.dispatchEvent(new CustomEvent('error'));

        // Assert
        expect(handler).toHaveBeenCalled();
        const toastEvent = handler.mock.calls[0][0];
        expect(toastEvent.detail.title).toBe('Error');
        expect(toastEvent.detail.message).toBe(
            'An error occurred while updating the record.',
        );
        expect(toastEvent.detail.variant).toBe('error');
    });
});
