// eslint-disable-next-line import/no-cycle

import { State } from "./state";

export type Getters = {
  formattedLinkedClassifications(state: State): any;
};

export const getters: Getters = {
  formattedLinkedClassifications: (state) => (classifications) => {
    return classifications.map((classification) => {
      if (
        classification &&
        classification.hasOwnProperty("isAutoClassification") &&
        classification.isAutoClassification
      ) {
        return {
          ...classification,
          hideRemoveButton: false,
        };
      } else if (
        classification.propagate &&
        classification.entityGuid &&
        state.selectedAsset.guid !== classification.entityGuid
      ) {
        return {
          ...classification,
          hideRemoveButton: true,
        };
      }
      return {
        ...classification,
        hideRemoveButton: false,
      };
    });
  },
};
