/* eslint-disable guard-for-in */

export default class MgRelatedListHelper {
    processData(data, state) {
        // Extract the records from the data
        const records = data.records;

        // Generate links for the records
        this.generateLinks(records);

        // Adjust the title based on the number of records
        if (records.length > state.numberOfRecords) {
            records.pop(); // Remove the last record if there are more records than requested
            data.title = `${data.sobjectLabelPlural} (${state.numberOfRecords}+)`;
        } else {
            data.title = `${data.sobjectLabelPlural} (${Math.min(state.numberOfRecords, records.length)})`;
        }

        // Return the processed data
        return data;
    }

    initColumnsWithActions(columns, customActions) {
        // Set default custom actions if none are provided
        if (!customActions.length) {
            customActions = [
                { label: 'Edit', name: 'edit' },
                { label: 'Delete', name: 'delete' },
            ];
        }

        // Update columns to render Id and Name fields as URLs
        columns = columns.map((column) => {
            if (column.fieldName.toLowerCase() === 'id') {
                column.type = 'url';
                column.fieldName = 'IdUrl'; // Use the IdUrl field for URLs
                column.typeAttributes = {
                    label: { fieldName: 'Id' },
                    target: '_blank',
                    tooltip: 'Go to record page',
                };
            } else if (column.fieldName.toLowerCase() === 'name') {
                column.type = 'url';
                column.fieldName = 'NameUrl'; // Use the NameUrl field for URLs
                column.typeAttributes = {
                    label: { fieldName: 'Name' },
                    target: '_blank',
                    tooltip: 'Go to record page',
                };
            }

            return column;
        });

        // Add action column to the columns array
        return [
            ...columns,
            { type: 'action', typeAttributes: { rowActions: customActions } },
        ];
    }

    generateLinks(records) {
        // Iterate over each record to generate links
        records.forEach((record) => {
            // Create URL fields for Id and Name
            record.LinkName = '/' + record.Id;
            record.IdUrl = '/' + record.Id; // Create URL field for Id
            record.NameUrl = '/' + record.Id; // Create URL field for Name

            // Iterate over each property in the record
            for (const propertyName in record) {
                const propertyValue = record[propertyName];

                // Check if the property value is an object
                if (typeof propertyValue === 'object') {
                    const newValue = propertyValue.Id
                        ? '/' + propertyValue.Id
                        : null;

                    // Flatten the nested object structure
                    this.flattenStructure(
                        record,
                        propertyName + '_',
                        propertyValue,
                    );

                    // Create a new link name property if newValue is not null
                    if (newValue !== null) {
                        record[propertyName + '_LinkName'] = newValue;
                    }
                }
            }
        });
    }

    flattenStructure(topObject, prefix, toBeFlattened) {
        // Iterate over each property in the nested object
        for (const propertyName in toBeFlattened) {
            const propertyValue = toBeFlattened[propertyName];

            // Recursively flatten nested objects
            if (typeof propertyValue === 'object') {
                this.flattenStructure(
                    topObject,
                    prefix + propertyName + '_',
                    propertyValue,
                );
            } else {
                // Add the flattened property to the top object
                topObject[prefix + propertyName] = propertyValue;
            }
        }
    }
}
