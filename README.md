# Custom Related List and Edit Modal Lightning Web Components

Welcome to the **Custom Related List** and **Edit Modal** LWC repository! This project includes two powerful Lightning Web Components designed to enhance Salesforce record pages with customizable and dynamic related lists and a sleek edit modal interface. 

## Components Overview

### 1. mgRelatedList

The `mgRelatedList` component allows you to create fully customizable related lists on Salesforce record pages. This component supports various configurations and customization options via the Lightning App Builder.

#### Key Features:
- **Customization:** Tailor the related list display using the Lightning App Builder. Customize fields, number of records, buttons to show or hide, and layout to suit your needs.
- **Multi-Direction Relationships:** Display child-to-parent, parent-to-child, and even unrelated objects that share correlatable ID fields.
- **Dynamic Schema Reading:** Automatically adjusts to the schema changes, ensuring relevant data representation.
- **CRUD Operations:** Supports creating, editing, and deleting records directly from the list.
- **Refresh on Action:** Automatically refreshes the list upon any CRUD operation, keeping data up-to-date without manual intervention.

#### Usage:
- **Record Pages Only:** This component is available exclusively for record pages.
- **Customization:** Use the Lightning App Builder to add and configure this component on the desired record page.

### 2. mgEditRecordModal

The `mgEditRecordModal` component is a sleek and efficient modal interface for editing records directly from the data table provided by `mgRelatedList`.

#### Key Features:
- **LightningModal Integration:** Utilizes the `LightningModal` component for a seamless and modern user experience.
- **Inline Editing:** Edit records directly from the modal, providing a smooth user experience.
- **Data Sync:** Automatically returns a value that can be used by parent components to refresh the data upon record edits.

## Installation and Setup

To use these components, follow the standard process for deploying LWCs in your Salesforce org:

1. Clone the repository.
2. Deploy the components to your Salesforce org using Salesforce CLI.
3. Add and configure the components using the Lightning App Builder.

PS: Make sure the record page is activated with the appropriate org, app, or record type configurations.

## Limitations

- **Desktop Only:** The components are currently optimized for desktop use and may not display correctly on mobile devices.
- **Child to Parent Limitation:** The component does not support a "View All" link for child-to-parent relationships due to Salesforce platform constraints.

## Contributing

I encourage LWC developers to use this repository as a starting point for creating their own custom components. Feel free to fork the repository, make enhancements, and share your improvements.

## Feedback and Support

If you encounter any issues or have suggestions for improvement, please open an issue in the GitHub repository. I really appreciate your feedback and contributions to making these components better!
