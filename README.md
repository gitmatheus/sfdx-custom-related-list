# Custom Related List and Edit Modal Lightning Web Components 

Welcome to the **Custom Related List** and **Edit Modal** LWC repository! This project includes two powerful Lightning Web Components designed to enhance Salesforce record pages with customizable and dynamic related lists and a sleek edit modal interface. 

![RelatedListMain](https://github.com/user-attachments/assets/de029f59-049e-4af2-92dd-e78f6b6d211b)

## Components Overview

### mgRelatedList and mgEditRecordModal components 🗂️

The `mgRelatedList` component allows you to create fully customizable related lists on Salesforce record pages. This component supports various configurations and customization options via the Lightning App Builder.

#### Key Features:
![RelatedListLWCOverview](https://github.com/user-attachments/assets/d27d8732-c39a-4c06-a85f-0fb0e5f87046)

https://github.com/user-attachments/assets/9329d7a6-a95d-4785-95d8-3a2c1c77bc70

https://github.com/user-attachments/assets/ed00dd69-8360-4e34-b78f-d957afb5f203

#### 🎨 UI & UX Note
The component UI and UX follow Salesforce's standard Lightning Design System (SLDS) to provide a seamless and cohesive user experience consistent with the rest of the Salesforce ecosystem.

#### Usage:
- **📄 Record Pages Only:** This component is available exclusively for record pages.
- **⚙️ Customization:** Use the Lightning App Builder to add and configure this component on the desired record page.

## 🚀 Installation and Setup

To use these components, follow the standard process for deploying LWCs in your Salesforce org:

1. 📥 Clone the repository.
2. 🚀 Deploy the components to your Salesforce org using Salesforce CLI.
3. 🛠️ Add and configure the components using the Lightning App Builder.

![Screenshot 2024-07-24 at 11 15 05 PM](https://github.com/user-attachments/assets/edc12fcf-20ff-4408-a025-31ae076eef2a)

**PS:** Make sure the record page is activated with the appropriate org, app, or record type configurations.

## Folder Structure

As in most SFDX projects, this repository is organized as follows:

- **LWC Components (`lwc/`)**:
  - `mgRelatedList`: Contains the files for the `mgRelatedList` component, including HTML, JavaScript, metadata configuration, and optional CSS.
  - `mgEditRecordModal`: Contains the files for the `mgEditRecordModal` component, structured similarly to `mgRelatedList`.

- **Apex Classes (`classes/`)**:
  - `MgRelatedListController.cls`: The Apex controller supporting the `mgRelatedList` component, handling server-side logic.
  - `MgRelatedListControllerTest.cls`: The test class for `MgRelatedListController`, ensuring code coverage and proper functionality.

```
project-root/
│
├── force-app/
│   ├── main/
│   │   ├── default/
│   │   │   ├── lwc/
│   │   │   │   ├── mgRelatedList/
│   │   │   │   │   ├── mgRelatedList.html
│   │   │   │   │   ├── mgRelatedList.js
│   │   │   │   │   ├── mgRelatedList.js-meta.xml
│   │   │   │   │   ├── mgRelatedListHelper.js
│   │   │   │   │   └── mgRelatedList.css
│   │   │   │   ├── mgEditRecordModal/
│   │   │   │   │   ├── mgEditRecordModal.html
│   │   │   │   │   ├── mgEditRecordModal.js
│   │   │   │   │   └── mgEditRecordModal.js-meta.xml
│   │   │   │   └── ... 
│   │   │   │
│   │   │   ├── classes/
│   │   │   │   ├── MgRelatedListController.cls
│   │   │   │   ├── MgRelatedListController.cls-meta.xml
│   │   │   │   ├── MgRelatedListControllerTest.cls
│   │   │   │   └── MgRelatedListControllerTest.cls-meta.xml
│   │   │   └── ... 
│   └── ... 
└── ... 
```

## ⚠️ Limitations

- **💻 Desktop Only:** The components are currently optimized for desktop use and may not display correctly on mobile devices.
- **↔️ Child to Parent Limitation:** The component does not support a "View All" link for child-to-parent relationships due to Salesforce platform constraints.

## 🤝 Contributing

I encourage LWC developers to use this repository as a starting point for creating their own custom components. Feel free to fork the repository, make enhancements, and share your improvements.

## 📬 Feedback and Support

If you encounter any issues or have suggestions for improvement, please open an issue in the GitHub repository. I really appreciate your feedback and contributions to making these components better!
