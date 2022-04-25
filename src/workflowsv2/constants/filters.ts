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
                icon: 'Schedule',
                iconClass: 'text-success',
            },
            {
                id: 'manual',
                label: 'Unscheduled',
                icon: 'Unscheduled',
            },
        ],
    },
]

export const runStatuses = [
    {
        value: 'Succeeded',
        label: 'Success',
        colorDot: '#00B28A',
    },
    {
        value: 'Running',
        label: 'Running',
        colorDot: '#F7B43D',
    },
    {
        value: ['Failed', 'Error'],
        label: 'Failed',
        colorDot: '#CC4747',
    },
    {
        value: 'Pending',
        label: 'Waiting',
        colorDot: '#6A7692',
    },
]
