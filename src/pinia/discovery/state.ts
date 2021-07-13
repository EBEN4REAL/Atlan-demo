export interface State {}

export const state: State = {
  filters: {
    status: {
      checked: [],
      condition: "OR",
      criterion: [],
    },
    classifications: {
      checked: [],
      condition: "OR",
      criterion: [],
    },
    owners: {
      userValue: "",
      groupValue: "",
      condition: "OR",
      criterion: [],
    },
    advanced: {
      list: [],
      condition: "OR",
      criterion: [],
    },
  },
};
