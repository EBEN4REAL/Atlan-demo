import { CollapseArray } from '~/types'

export const List: CollapseArray = [
  {
    id: 'workflowType',
    label: 'Workflow Source',
    component: 'workflowType',
    overallCondition: 'OR',
    filters: [
      {
        attributeName: 'workflowType',
        condition: 'OR',
        isMultiple: false,
        operator: 'eq',
      },
    ],
    isDeleted: false,
    isDisabled: false,
    exclude: false,
  },
]
