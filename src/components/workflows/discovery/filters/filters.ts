import { CollapseArray } from '~/types'

export const List: CollapseArray = [
    {
        id: 'status',
        label: 'Certificate',
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
    }
]
