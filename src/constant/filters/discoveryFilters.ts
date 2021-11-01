export const discoveryFilters = [
    {
        id: 'hierarchy',
        label: 'Connection',
        component: 'connection',
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'certificateStatus',
        label: 'Certificate',
        component: 'certificate',
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },

    {
        id: 'owners',
        label: 'Owners',
        component: 'owners',
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'terms',
        label: 'Terms',
        component: 'governance',
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'classifications',
        label: 'Classifications',
        component: 'classifications',
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'advanced',
        label: 'Properties',
        component: 'advanced',
        overallCondition: 'OR',
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
]
