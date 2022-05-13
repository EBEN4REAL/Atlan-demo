const date = [
    {
        id: 'lessThan',
        label: 'Before',
    },
    {
        id: 'greaterThan',
        label: 'After',
    },
    // {
    //     id: 'greaterThanEqual',
    //     label: 'Greater Than Equal(>=)',
    // },

    // {
    //     id: 'lessThanEqual',
    //     label: 'Less Than Equal(<=)',
    // }
]

const date_mandatory = [
    {
        id: 'lessThan',
        label: 'Before',
    },
    {
        id: 'greaterThan',
        label: 'After',
    },
    // {
    //     id: 'greaterThanEqual',
    //     label: 'Greater Than Equal(>=)',
    // },

    // {
    //     id: 'lessThanEqual',
    //     label: 'Less Than Equal(<=)',
    // }
]

export const operators = {
    enum: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
        {
            id: 'isNull',
            label: 'Is Null',
        },
        {
            id: 'isNotNull',
            label: 'Is Not Null',
        },
    ],
    SQL: [
        {
            id: 'contains',
            label: 'Contains',
        },
        {
            id: 'isNull',
            label: 'Is Null',
        },
        {
            id: 'isNotNull',
            label: 'Is Not Null',
        },
    ],
    string: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
        {
            id: 'startsWith',
            label: 'Starts With',
        },
        {
            id: 'endsWith',
            label: 'Ends With',
        },
        {
            id: 'contains',
            label: 'Contains',
        },
        {
            id: 'pattern',
            label: 'Pattern',
        },
        {
            id: 'isNull',
            label: 'Is Null',
        },
        {
            id: 'isNotNull',
            label: 'Is Not Null',
        },
    ],
    url: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
        {
            id: 'startsWith',
            label: 'Starts With',
        },
        {
            id: 'endsWith',
            label: 'Ends With',
        },
        {
            id: 'contains',
            label: 'Contains',
        },
        {
            id: 'pattern',
            label: 'Pattern',
        },
        {
            id: 'isNull',
            label: 'Is Null',
        },
        {
            id: 'isNotNull',
            label: 'Is Not Null',
        },
    ],
    int: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
        {
            id: 'greaterThan',
            label: 'Greater Than(>)',
        },
        {
            id: 'greaterThanEqual',
            label: 'Greater Than Equal(>=)',
        },
        {
            id: 'lessThan',
            label: 'Less Than(<)',
        },
        {
            id: 'lessThanEqual',
            label: 'Less Than Equal(<=)',
        },
    ],
    float: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
        {
            id: 'greaterThan',
            label: 'Greater Than(>)',
        },
        {
            id: 'greaterThanEqual',
            label: 'Greater Than Equal(>=)',
        },
        {
            id: 'lessThan',
            label: 'Less Than(<)',
        },
        {
            id: 'lessThanEqual',
            label: 'Less Than Equal(<=)',
        },
    ],
    long: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
        {
            id: 'greaterThan',
            label: 'Greater Than(>)',
        },
        {
            id: 'greaterThanEqual',
            label: 'Greater Than Equal(>=)',
        },
        {
            id: 'lessThan',
            label: 'Less Than(<)',
        },
        {
            id: 'lessThanEqual',
            label: 'Less Than Equal(<=)',
        },
    ],
    string_user: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
        {
            id: 'isNull',
            label: 'Is Null',
        },
        {
            id: 'isNotNull',
            label: 'Is Not Null',
        },
    ],
    string_user_mandatory: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
    ],
    string_announcement_mandatory: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
    ],
    string_mandatory: [
        {
            id: 'equals',
            label: 'Equals(=)',
        },
        {
            id: 'notEquals',
            label: 'Not Equals(!=)',
        },
        {
            id: 'startsWith',
            label: 'Starts With',
        },
        {
            id: 'endsWith',
            label: 'Ends With',
        },
        {
            id: 'contains',
            label: 'Contains',
        },
        {
            id: 'pattern',
            label: 'Pattern',
        },
    ],
    date_mandatory,
    dateTime_mandatory: [...date_mandatory],
    date,
    dateTime: [...date],
}
