// eslint-disable-next-line import/prefer-default-export
export const operatorsMap = {
    text: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Contains', value: 'contains' },
        { label: 'Begins with', value: 'startsWith' },
        { label: 'Ends with', value: 'endsWith' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is Not Null', value: 'notNull' },
    ],
    date: [
        { label: 'Greater than', value: 'gt' },
        { label: 'Less than', value: 'lt' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is Not Null', value: 'notNull' },
    ],
    boolean: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is not Null', value: '=' },
    ],
    number: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Greater than', value: 'gt' },
        { label: 'Less than', value: 'lt' },
        { label: 'Greater than or equal to', value: 'gte' },
        { label: 'Less than or equal to', value: 'lte' },
        { label: 'Is Null', value: '=' },
        { label: 'Is not Null', value: '=' },
    ],
    enum: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Is Null', value: '=' },
        { label: 'Is not Null', value: '=' },
    ],
};
