const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');
module.exports = {
    ...jestConfig,
    setupFiles: ['./jest.setup.js'],
    moduleNameMapper: {
        '^@salesforce/apex$': '<rootDir>/force-app/test/jest-mocks/apex',
        '^lightning/navigation$':
            '<rootDir>/force-app/test/jest-mocks/lightning/navigation',
        '^lightning/platformShowToastEvent$':
            '<rootDir>/force-app/test/jest-mocks/lightning/platformShowToastEvent',
        '^lightning/modal$':
            '<rootDir>/force-app/test/jest-mocks/lightning/modal',
        '^lightning/uiRecordApi$':
            '<rootDir>/force-app/test/jest-mocks/lightning/uiRecordApi',
        '^lightning/actions$':
            '<rootDir>/force-app/test/jest-mocks/lightning/actions',
    },
    testMatch: ['**/__tests__/**/*.test.js'],
};