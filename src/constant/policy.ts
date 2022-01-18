export const maskPersona = [
    {
        value: 'null',
        label: 'None',
        borderBottom: true,
    },
    // {
    //     value: 'MASK_DATE_SHOW_YEAR',
    //     label: 'Show only year',
    //     borderBottom: false,
    //     popover: {
    //         field: 'Date of birth',
    //         value: '24/4/1990',
    //         maskedValue: '01/01/1990',
    //         helpText:
    //             'Show only the year portion of a date string and default the month and day to 01/01',
    //     },
    // },

    {
        value: 'MASK_SHOW_FIRST_4',
        label: 'Show first 4',
        borderBottom: false,
        popover: {
            field: 'Credit card number',
            value: '4321 9876 1254 4444',
            maskedValue: '4321 xxxx xxxx xxxx',
            helpText: 'Shows only the first 4 characters',
        },
    },

    {
        value: 'MASK_SHOW_LAST_4',
        label: 'Show last 4',
        borderBottom: true,
        popover: {
            field: 'Phone number',
            value: '9112349678',
            maskedValue: 'xxxxxx9678',
            helpText: 'Shows only the last 4 characters',
        },
    },
    {
        value: 'MASK_HASH',
        label: 'Hash',
        borderBottom: false,
        popover: {
            field: 'Address',
            value: '123 Los Angeles Street',
            maskedValue: 'f43jknscakc12nk21ak',
            helpText:
                'Replaces all characters with a hash of entire cell value',
        },
    },
    {
        value: 'MASK_NULL',
        label: 'Nullify',
        borderBottom: false,
        popover: {
            field: 'Age',
            value: '22 years',
            maskedValue: 'NULL',
            helpText: 'Replaces all characters with NULL value',
        },
    },
    {
        value: 'MASK_REDACT',
        label: 'Redact',
        borderBottom: false,
        popover: {
            field: 'Address',
            value: '123 Los Angeles Street',
            maskedValue: 'nnn xxx xxxxxxx xxxxxx',
            helpText:
                'Masks all alphabetic characters with “x” and all numeric characters with “n”',
        },
    },
]

export const maskPurpose = [
    {
        value: 'null',
        label: 'None',
        borderBottom: true,
    },
    // {
    //     value: 'MASK_DATE_SHOW_YEAR',
    //     label: 'Show only year',
    //     borderBottom: false,
    //     popover: {
    //         field: 'Date of birth',
    //         value: '24/4/1990',
    //         maskedValue: '01/01/1990',
    //         helpText:
    //             'Show only the year portion of a date string and default the month and day to 01/01',
    //     },
    // },

    {
        value: 'heka:MASK_SHOW_FIRST_4',
        label: 'Show first 4',
        borderBottom: false,
        popover: {
            field: 'Credit card number',
            value: '4321 9876 1254 4444',
            maskedValue: '4312 xxxx xxxx xxxx',
            helpText: 'Shows only the first 4 characters',
        },
    },

    {
        value: 'heka:MASK_SHOW_LAST_4',
        label: 'Show last 4',
        borderBottom: true,
        popover: {
            field: 'Phone number',
            value: '9112349678',
            maskedValue: 'xxxxxx4375',
            helpText: 'Shows only the last 4 characters',
        },
    },
    {
        value: 'heka:MASK_HASH',
        label: 'Hash',
        borderBottom: false,
        popover: {
            field: 'Address',
            value: '123 Los Angeles Street',
            maskedValue: 'f43jknscakc12nk21ak',
            helpText:
                'Replaces all characters with a hash of entire cell value',
        },
    },
    {
        value: 'heka:MASK_NULL',
        label: 'Nullify',
        borderBottom: false,
        popover: {
            field: 'Age',
            value: '22 years',
            maskedValue: 'NULL',
            helpText: 'Replaces all characters with NULL value',
        },
    },
    {
        value: 'heka:MASK_REDACT',
        label: 'Redact',
        borderBottom: false,
        popover: {
            field: 'Address',
            value: '123 Los Angeles Street',
            maskedValue: 'nnn xxx xxxxxxx xxxxxx',
            helpText:
                'Masks all alphabetic characters with “x” and all numeric characters with “n”',
        },
    },
]
