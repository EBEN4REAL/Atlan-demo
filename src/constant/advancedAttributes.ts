export type ISearchOperators =
    | 'eq'
    | 'neq'
    | 'contains'
    | 'startsWith'
    | 'endsWith'
    | 'isNull'
    | 'notNull'
    | 'gt'
    | 'lt'
    | 'gte'
    | 'lte'

export const AdvancedAttributeList = [
    {
        value: '__guid',
        label: 'Unique ID (GUID)',
        typeName: 'string',
    },
    {
        value: '__modificationTimestamp',
        label: 'Last updated at',
        typeName: 'date',
    },
    {
        value: '__modifiedBy',
        label: 'Last updated by',
        typeName: 'users',
        children: [],
    },
    {
        value: '__createdBy',
        label: 'Created by',
        typeName: 'users',
    },
    {
        value: '__timestamp',
        label: 'Created at',
        typeName: 'date',
    },
    {
        value: 'sourceCreatedBy',
        label: 'Source created by',
        typeName: 'users',
    },
    {
        value: 'sourceCreatedAt',
        label: 'Source created at',
        typeName: 'date',
    },
    {
        value: 'sourceUpdatedBy',
        label: 'Source updated by',
        typeName: 'users',
    },
    {
        value: 'sourceUpdatedAt',
        label: 'Source updated at',
        typeName: 'date',
    },
    {
        value: 'popularityScore',
        label: 'Popularity Score',
        typeName: 'number',
        hide: true,
    },
]

export const OperatorList = [
    {
        value: '=',
        label: '=',
        allowedType: ['string', 'enumeration'],
        isInput: true,
    },
    {
        value: 'neq',
        label: '!=',
        allowedType: ['string', 'enumeration'],
        isInput: true,
    },

    {
        value: 'contains',
        label: 'contains',
        allowedType: ['string', 'users'],
        isInput: true,
    },
    {
        value: 'startsWith',
        label: 'begins with',
        allowedType: ['string'],
        isInput: true,
    },
    {
        value: 'endsWith',
        label: 'ends with',
        allowedType: ['string'],
        isInput: true,
    },
    {
        value: 'gt',
        label: '>',
        allowedType: ['int', 'float', 'double', 'long', 'date'],
        isInput: true,
    },
    {
        value: 'lt',
        label: '<',
        allowedType: ['int', 'float', 'double', 'long', 'date'],
        isInput: true,
    },
    {
        value: 'gte',
        label: '>=',
        allowedType: ['int', 'float', 'double', 'long'],
        isInput: true,
    },
    {
        value: 'lte',
        label: '<=',
        allowedType: ['int', 'float', 'double', 'long'],
        isInput: true,
    },
    {
        value: 'timerange',
        label: '<>',
        allowedType: ['date'],
        isInput: true,
    },
    {
        value: 'isNull',
        label: 'is null',
        allowedType: [
            'string',
            'byte',
            'short',
            'int',
            'float',
            'double',
            'long',
            'date',
            'boolean',
            'enumeration',
            'users',
        ],
        isInput: false,
    },
    {
        value: 'notNull',
        label: 'is not null',
        allowedType: [
            'string',
            'byte',
            'short',
            'int',
            'float',
            'double',
            'long',
            'date',
            'boolean',
            'enumeration',
            'users',
        ],
        isInput: false,
    },
]

export const operatorsMap = {
    string: [
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
        { label: 'Is not Null', value: 'notNull' },
    ],
    number: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Greater than', value: 'gt' },
        { label: 'Less than', value: 'lt' },
        { label: 'Greater than or equal to', value: 'gte' },
        { label: 'Less than or equal to', value: 'lte' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is not Null', value: 'notNull' },
    ],
    users: [
        { label: 'Equal', value: 'eq' },
        { label: 'Doesn’t equal', value: 'neq' },
        { label: 'Contains', value: 'contains' },
        { label: 'Is Null', value: 'isNull' },
        { label: 'Is not Null', value: 'notNull' },
    ],
}
