import { CollapseArray } from '~/types'

export const List: CollapseArray = [
    // {
    //     id: 'connector',
    //     label: 'Connector',
    //     component: 'connector',
    //     overallCondition: 'OR',
    //     filters: [
    //         {
    //             attributeName: 'connector',
    //             condition: 'OR',
    //             isMultiple: false,
    //             operator: 'eq',
    //         },
    //     ],
    //     isDeleted: false,
    //     isDisabled: false,
    //     exclude: false,
    // },
    {
        id: 'assetCategory',
        label: 'Category',
        component: 'assetCategory',
        overallCondition: 'OR',
        filters: [
            {
                attributeName: 'assetCategory',
                condition: 'OR',
                isMultiple: false,
                operator: 'eq',
            },
        ],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'status',
        label: 'Status',
        component: 'status',
        overallCondition: 'OR',
        filters: [
            {
                attributeName: 'assetStatus',
                condition: 'OR',
                isMultiple: false,
                operator: 'eq',
            },
        ],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'owners',
        label: 'Owners',
        component: 'owners',
        overallCondition: 'OR',
        filters: [
            {
                attributeName: 'ownerUsers',
                condition: 'OR',
                isMultiple: true,
                operator: 'contains',
            },
            {
                attributeName: 'ownerGroups',
                condition: 'OR',
                isMultiple: true,
                operator: 'contains',
            },
        ],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
    {
        id: 'classifications',
        label: 'Classifications',
        component: 'classifications',
        overallCondition: 'OR',
        filters: [
            {
                attributeName: '__classificationNames',
                condition: 'OR',
                isMultiple: false,
                operator: 'eq',
            },
            {
                attributeName: '__propagatedClassificationNames',
                condition: 'OR',
                isMultiple: false,
                operator: 'eq',
            },
        ],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },

    {
        id: 'advanced',
        label: 'Properties',
        component: 'advanced',
        overallCondition: 'OR',
        filters: [
            {
                attributeName: 'ownerUsers',
                condition: 'OR',
                isMultiple: true,
                operator: 'contains',
            },
            {
                attributeName: 'ownerGroups',
                condition: 'OR',
                isMultiple: true,
                operator: 'contains',
            },
        ],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
    },
]
