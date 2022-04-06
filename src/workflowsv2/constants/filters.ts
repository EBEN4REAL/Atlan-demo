export const runFilter = [
    {
        id: 'creators',
        label: 'CREATED BY',
        component: 'Owners',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        propsToComponent: {
            showNone: false,
            hideDisabledTabs: true,
            enableTabs: ['users'],
        },
        // selectUserKey: 'id',
        class: 'bg-transparent',
    },
]

export const workflowFilter = [
    {
        id: 'creators',
        label: 'CREATED BY',
        component: 'Owners',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        propsToComponent: {
            showNone: false,
            hideDisabledTabs: true,
            enableTabs: ['users'],
        },
        // selectUserKey: 'id',
        class: 'bg-transparent',
    },
    {
        id: 'wfType',
        label: 'Workflow Type',
        component: 'CheckBoxOption',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
        data: [],
    },
    {
        id: 'schedule',
        label: 'Schedule',
        component: 'RadioButton',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
        data: [
            {
                id: 'scheduled',
                label: 'Scheduled',
            },
            {
                id: 'manual',
                label: 'Unscheduled',
            },
        ],
    },
]

export const runStatuses = [
    {
        label: 'All',
        value: undefined,
    },
    {
        value: 'Running',
        label: 'Running',
        colorDot: '#FFBA52',
    },
    {
        value: 'Succeeded',
        label: 'Success',
        colorDot: '#00A680',
    },
    {
        value: ['Failed', 'Error'],
        label: 'Failed',
        colorDot: '#DC5252',
    },
    {
        value: 'Pending',
        label: 'Pending',
        colorDot: '#6F7950',
    },
]
