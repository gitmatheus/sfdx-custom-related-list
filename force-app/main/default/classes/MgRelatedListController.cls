public with sharing class MgRelatedListController {
    public static final String PARAM_RECORD_ID = 'recordId';
    public static final String PARAM_SOBJECT_API_NAME = 'fromObjectApiName';
    public static final String PARAM_SOBJECT_LABEL = 'sobjectLabel';
    public static final String PARAM_SOBJECT_LABEL_PLURAL = 'sobjectLabelPlural';
    public static final String PARAM_SOURCE_FIELD_API_NAME = 'sourceFieldApiName';
    public static final String PARAM_SOURCE_FIELD_VALUE = 'sourceFieldValue';
    public static final String PARAM_RELATED_FIELD_API_NAME = 'relatedFieldApiName';
    public static final String PARAM_PARENT_RELATIONSHIP_API_NAME = 'parentRelationshipApiName';
    public static final String PARAM_FIELDS = 'fields';
    public static final String PARAM_NUMBER_OF_RECORDS = 'numberOfRecords';
    public static final String PARAM_SORTED_BY = 'orderBy';
    public static final String PARAM_RECORDS = 'records';
    public static final String PARAM_ICON_NAME = 'iconName';

    @AuraEnabled(cacheable=true)
    public static String fetchObjectFields(String jsonData) {
        Map<String, Object> stateMap = (Map<String, Object>) JSON.deserializeUntyped(
            jsonData
        );

        String fromObjectApiName = (String) stateMap.get(
            PARAM_SOBJECT_API_NAME
        );

        // Creates a list of normalized field names
        List<String> fieldsList = new List<String>();
        for (
            String field : ((String) stateMap.get(PARAM_FIELDS))
                ?.toLowerCase()
                ?.split(',')
        ) {
            fieldsList.add(field.trim());
        }

        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe()
            .get(fromObjectApiName)
            .getDescribe()
            .fields.getMap();

        // Map if fields, and their properties map (name, label, attributes)
        List<Map<String, Object>> validFields = new List<Map<String, Object>>();

        for (String fieldName : fieldsList) {
            if (fieldMap.containsKey(fieldName)) {
                Schema.SObjectField field = fieldMap.get(fieldName);

                Schema.DescribeFieldResult fieldDescribe = field.getDescribe();

                Map<String, Object> fieldInfo = new Map<String, Object>();
                fieldInfo.put('name', fieldDescribe.getName());
                fieldInfo.put('label', fieldDescribe.getLabel());
                fieldInfo.put(
                    'type',
                    fieldDescribe.getType().name().toLowerCase()
                );

                // Special attributes for URLs
                if (fieldDescribe.getType() == Schema.DisplayType.Url) {
                    fieldInfo.put(
                        'typeAttributes',
                        new Map<String, Object>{
                            'label' => fieldDescribe.getName(),
                            'target' => '_top'
                        }
                    );
                }
                validFields.add(fieldInfo);
            }
        }

        return JSON.serialize(validFields);
    }

    @AuraEnabled(cacheable=true)
    public static String fetchRelatedListData(String jsonData) {
        // Deserialize the JSON string into a map of key-value pairs
        Map<String, Object> stateMap = (Map<String, Object>) JSON.deserializeUntyped(
            jsonData
        );

        // Create a response map to store the results
        Map<String, Object> responseMap = new Map<String, Object>();

        // Fetch related records based on the provided JSON data
        responseMap.put(PARAM_RECORDS, getRecords(jsonData));

        // Retrieve the API name of the object to get related records from
        String fromObjectApiName = (String) stateMap.get(
            PARAM_SOBJECT_API_NAME
        );

        // Retrieve the icon name from the configuration
        // If not provided, determine the default icon based on the object API name
        String iconName = (String) stateMap.get(PARAM_ICON_NAME);

        if (iconName == null || iconName.trim() == '') {
            iconName = getObjectIcon(fromObjectApiName);
        }

        // Add the determined or default icon name to the response map
        responseMap.put(PARAM_ICON_NAME, iconName);

        // Retrieve the record ID and related field API name from the state map
        String recordId = (String) stateMap.get(PARAM_RECORD_ID);
        String relatedFieldApiName = (String) stateMap.get(
            PARAM_RELATED_FIELD_API_NAME
        );

        // Get the parent relationship name and add it to the response map
        responseMap.put(
            PARAM_PARENT_RELATIONSHIP_API_NAME,
            getParentRelationshipName(
                recordId,
                fromObjectApiName,
                relatedFieldApiName
            )
        );

        // Retrieve the schema information for the object type
        Schema.SObjectType sobjectType = Schema.getGlobalDescribe()
            .get(fromObjectApiName);
        Schema.DescribeSObjectResult sobjectDescribe = sobjectType.getDescribe();

        // Add the object label and plural label to the response map
        responseMap.put(PARAM_SOBJECT_LABEL, sobjectDescribe.getLabel());
        responseMap.put(
            PARAM_SOBJECT_LABEL_PLURAL,
            sobjectDescribe.getLabelPlural()
        );

        // Serialize the response map to JSON and return it
        return JSON.serialize(responseMap);
    }

    @AuraEnabled(cacheable=true)
    public static List<Sobject> getRecords(String jsonData) {
        // Deserialize the JSON string into a map of key-value pairs
        Map<String, Object> stateMap = (Map<String, Object>) JSON.deserializeUntyped(
            jsonData
        );

        // Retrieve the fields to be queried from the map
        String fields = (String) stateMap.get(PARAM_FIELDS);

        // Retrieve the number of records to limit the query from the map
        Integer numberOfRecords = (Integer) stateMap.get(
            PARAM_NUMBER_OF_RECORDS
        );

        // Retrieve the value of the source field to be used in the WHERE clause of the query
        String sourceFieldValue = (String) stateMap.get(
            PARAM_SOURCE_FIELD_VALUE
        );

        // Retrieve the API name of the related field to be used in the WHERE clause
        String relatedFieldApiName = (String) stateMap.get(
            PARAM_RELATED_FIELD_API_NAME
        );

        // Retrieve the API name of the source object
        String fromObjectApiName = (String) stateMap.get(
            PARAM_SOBJECT_API_NAME
        );

        // Retrieve the field name to sort the results by
        String orderBy = (String) stateMap.get(PARAM_SORTED_BY);

        // Construct the SOQL query string using the retrieved parameters
        String query =
            'SELECT ' +
            fields +
            ' FROM ' +
            fromObjectApiName +
            ' WHERE ' +
            relatedFieldApiName +
            '= :sourceFieldValue ' +
            'ORDER BY ' +
            orderBy +
            ' LIMIT :numberOfRecords';

        // Create a map for bind variables to prevent SOQL injection and bind the variables
        Map<String, Object> bindVariables = new Map<String, Object>();
        bindVariables.put('sourceFieldValue', sourceFieldValue);
        bindVariables.put('numberOfRecords', numberOfRecords);

        // Execute the query with bind variables in USER_MODE to enforce user permissions
        return Database.queryWithBinds(
            String.escapeSingleQuotes(query),
            bindVariables,
            AccessLevel.USER_MODE
        );
    }

    private static String getParentRelationshipName(
        Id recordId,
        String childfromObjectApiName,
        String relatedFieldApiName
    ) {
        Schema.DescribeSObjectResult descrRes = recordId.getSObjectType()
            .getDescribe();
        String name;
        for (Schema.ChildRelationship cr : descrRes.getChildRelationships()) {
            if (
                cr.getChildSObject().getDescribe().getName() ==
                childfromObjectApiName &&
                cr.getField().getDescribe().getName() == relatedFieldApiName
            ) {
                name = cr.getRelationshipName();
                break;
            }
        }
        return name;
    }

    @AuraEnabled
    public static String getObjectIcon(String fromObjectApiName) {
        String iconName;
        List<Schema.DescribeTabSetResult> tabSetResults = Schema.DescribeTabs();
        List<Schema.DescribeTabResult> tabs = new List<Schema.DescribeTabResult>();
        List<Schema.DescribeIconResult> icons = new List<Schema.DescribeIconResult>();

        for (Schema.DescribeTabSetResult tabSetResult : tabSetResults) {
            tabs.addAll(tabSetResult.getTabs());
        }

        for (Schema.DescribeTabResult tab : tabs) {
            if (fromObjectApiName == tab.getSobjectName()) {
                if (tab.isCustom()) {
                    icons.addAll(tab.getIcons());
                } else {
                    iconName = 'standard:' + fromObjectApiName.toLowerCase();
                }
            }
        }
        for (Schema.DescribeIconResult icon : icons) {
            if (icon.getContentType() == 'image/svg+xml') {
                iconName =
                    'custom:' +
                    icon.getUrl()
                        .substringBetween('custom/', '.svg')
                        .substringBefore('_');
                break;
            }
        }
        return iconName;
    }
}
