export interface State {}

export const state: State = {
  filters: {
    status: {
      condition: "OR",
      criterion: [],
    },
    classifications: {
      condition: "OR",
      criterion: [],
    },
    owners: {
      condition: "OR",
      criterion: [],
    },
    advanced: {
      condition: "OR",
      criterion: [],
    },
  },
};
