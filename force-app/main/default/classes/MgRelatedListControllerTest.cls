@isTest
public class MgRelatedListControllerTest {
    @isTest
    public static void testFetchObjectFields() {
        Map<String, Object> stateMap = new Map<String, Object>();
        stateMap.put(
            MgRelatedListController.PARAM_FIELDS,
            'Name, Email, Phone'
        );
        stateMap.put(
            MgRelatedListController.PARAM_SOBJECT_API_NAME,
            'Contact'
        );

        Test.startTest();
        String jsonData = MgRelatedListController.fetchObjectFields(
            JSON.serialize(stateMap)
        );

        // Map if fields, and their properties map (name, label, attributes)
        // Behind the scenes, this is a Map<String, Map<String, Object>>
        List<Object> validFields = (List<Object>) JSON.deserializeUntyped(
            jsonData
        );
        Test.stopTest();

        // Verify that the returned fields are correct and contain the necessary attributes
        System.assertEquals(3, validFields.size(), 'Expected 3 valid fields');

        // Using numbers for index to make sure the fields were added in the right order
        Map<String, Object> nameField = (Map<String, Object>) validFields.get(
            0
        );
        System.assertEquals(
            'Name',
            nameField.get('name'),
            'Expected Name field name'
        );
        System.assertEquals(
            'Full Name',
            nameField.get('label'),
            'Expected Name field label'
        );
        System.assertEquals(
            'string',
            nameField.get('type'),
            'Expected Name field type'
        );

        Map<String, Object> emailField = (Map<String, Object>) validFields.get(
            1
        );
        System.assertEquals(
            'Email',
            emailField.get('name'),
            'Expected Email field name'
        );
        System.assertEquals(
            'Email',
            emailField.get('label'),
            'Expected Email field label'
        );
        System.assertEquals(
            'email',
            emailField.get('type'),
            'Expected Email field type'
        );

        Map<String, Object> phoneField = (Map<String, Object>) validFields.get(
            2
        );
        System.assertEquals(
            'Phone',
            phoneField.get('name'),
            'Expected Phone field name'
        );
        System.assertEquals(
            'Business Phone',
            phoneField.get('label'),
            'Expected Phone field label'
        );
        System.assertEquals(
            'phone',
            phoneField.get('type'),
            'Expected Phone field type'
        );
    }

    @isTest
    public static void testFetchRelatedListData() {
        Account acc = new Account(Name = 'test');
        insert acc;
        Contact cnt = new Contact(LastName = 'test', AccountId = acc.Id);
        insert cnt;

        Map<String, Object> stateMap = new Map<String, Object>();
        stateMap.put(
            MgRelatedListController.PARAM_FIELDS,
            'Name, Title, Email, Phone'
        );
        stateMap.put(
            MgRelatedListController.PARAM_RELATED_FIELD_API_NAME,
            'AccountId'
        );
        stateMap.put(MgRelatedListController.PARAM_RECORD_ID, acc.Id);
        stateMap.put(MgRelatedListController.PARAM_NUMBER_OF_RECORDS, 1);
        stateMap.put(
            MgRelatedListController.PARAM_SOBJECT_API_NAME,
            'Contact'
        );
        stateMap.put(
            MgRelatedListController.PARAM_SOURCE_FIELD_VALUE,
            acc.Id
        );
        stateMap.put(MgRelatedListController.PARAM_SORTED_BY, 'Name ASC');

        String jsonData = MgRelatedListController.fetchRelatedListData(
            JSON.serialize(stateMap)
        );
        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(
            jsonData
        );
        List<Object> records = (List<Object>) responseMap.get(
            MgRelatedListController.PARAM_RECORDS
        );
        System.assert(!records.isEmpty());
        String iconName = (String) responseMap.get(
            MgRelatedListController.PARAM_ICON_NAME
        );
        System.assert(String.isNotBlank(iconName));
    }
}
