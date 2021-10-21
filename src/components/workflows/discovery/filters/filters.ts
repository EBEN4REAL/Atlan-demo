import { CollapseArray } from '~/types'

export const List: CollapseArray = [
  // {
  //   id: 'workflowCategory',
  //   label: 'Category',
  //   component: 'workflowCategory',
  //   overallCondition: 'OR',
  //   filters: [
  //     {
  //       attributeName: 'workflowCategory',
  //       condition: 'OR',
  //       isMultiple: false,
  //       operator: 'eq',
  //     },
  //   ],
  //   isDeleted: false,
  //   isDisabled: false,
  //   exclude: false,
  // },
  // {
  //   id: 'workflowType',
  //   label: 'Workflow Type',
  //   component: 'workflowType',
  //   overallCondition: 'OR',
  //   filters: [
  //     {
  //       attributeName: 'workflowType',
  //       condition: 'OR',
  //       isMultiple: false,
  //       operator: 'eq',
  //     },
  //   ],
  //   isDeleted: false,
  //   isDisabled: false,
  //   exclude: false,
  // },
  {
    id: 'owners',
    label: 'Created by',
    component: 'createdBy',
    overallCondition: 'OR',
    filters: [
      {
        attributeName: 'ownerUsers',
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
