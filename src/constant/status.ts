import { CheckboxArray } from '~/types'

export const List: CheckboxArray = [
    {
        id: 'verified',
        label: 'Verified',
        description: 'Verified',
        icon: 'fas badge-check',
        iconClass: 'text-green-500',
    },
    {
        id: 'draft',
        label: 'Draft',
        description: 'Draft',
        icon: 'fas badge',
        iconClass: 'text-yellow-500',
    },
    {
        id: 'issue',
        label: 'Issue',
        description: 'Issue',
        icon: 'fas exclamation-triangle',
        iconClass: 'text-red-500',
    },
    {
        id: 'deprecated',
        label: 'Deprecated',
        description: 'Deprecated',
        icon: 'fas minus-circle',
        iconClass: 'text-gray-500',
    },
    {
        id: 'no status',
        label: 'No Status',
        description: 'No Status',
        icon: 'fal circle',
        iconClass: 'text-gray-500',
    },
]
