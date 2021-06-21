import { GetterTree } from "vuex";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

import { State } from "./state";

export type Getters = {
  getActualFilters(state: State): any;
};

export const getters: GetterTree<State, RootState> & Getters = {
  getActualFilters: (state) => (filters = {}) => {
    const filterKeys = Object.keys(filters);
    const newFilters = {};
    filterKeys.forEach((filterKey) => {
      if (filterKey === "savedFilters") {
        let temp = JSON.parse(JSON.stringify(filters.savedFilters));
        temp = temp.map((t) => {
          const tempObj = state.savedFilters.find(
            (savedFilter) => savedFilter.alias === t
          );
          if (tempObj) {
            return tempObj.value || "";
          }
          return t;
        });
        newFilters[filterKey] = temp;
      } else {
        newFilters[filterKey] = filters[filterKey];
      }
    });
    return newFilters;
  },
};
