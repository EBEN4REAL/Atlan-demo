import { CollapseArray } from "~/types";

export const List: CollapseArray = [
  {
    id: "status",
    label: "Status",
    component: "status",
    overallCondition: "OR",
    filters: [
      {
        attributeName: "assetStatus",
        condition: "OR",
        isMultiple: false,
        operator: "eq",
      },
    ],
    isDeleted: false,
    isDisabled: false,
  },
  {
    id: "owners",
    label: "Owners",
    component: "owners",
    overallCondition: "OR",
    filters: [
      {
        attributeName: "ownerUsers",
        condition: "OR",
        isMultiple: true,
        operator: "contains",
      },
      {
        attributeName: "ownerGroups",
        condition: "OR",
        isMultiple: true,
        operator: "contains",
      },
    ],
    isDeleted: false,
    isDisabled: false,
  }, {
    id: "advanced",
    label: "Advanced",
    component: "advanced",
    overallCondition: "OR",
    filters: [
      {
        attributeName: "ownerUsers",
        condition: "OR",
        isMultiple: true,
        operator: "contains",
      },
      {
        attributeName: "ownerGroups",
        condition: "OR",
        isMultiple: true,
        operator: "contains",
      },
    ],
    isDeleted: false,
    isDisabled: false,
  }
];
