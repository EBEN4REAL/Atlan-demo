import { Getters } from "./getters";
import { State } from "./state";

export interface Actions extends State, Getters {
  setFilterCriterion(filterType: any, value: any): void;
}

export const actions: Actions = {
  // filters
  setFilterCriterion(filterType, criterion) {
    switch (filterType) {
      case "classifications": {
        this.filters.classifications.criterion = criterion;
        break;
      }
      case "status": {
        this.filters.status.criterion = criterion;
        break;
      }
      case "owners": {
        this.filters.owners.criterion = criterion;
        break;
      }
      case "advanced": {
        this.filters.advanced.criterion = criterion;
        break;
      }
    }
  },
};
