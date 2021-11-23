export const queryLogsFilter = [
    {
        id: 'queryStatus',
        label: 'STATUS',
        component: 'queryStatus',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
    },
    {
        id: 'users',
        label: 'Users',
        component: 'owners',
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
        class: 'bg-transparent',
    },
]
