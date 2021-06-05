import { GetterTree } from "vuex";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

import { State } from "./state";

export type Getters = {
  // getAssetTypes(state: State): Components.Schemas.AtlasEntityDef[] | null;
};

export const getters: GetterTree<State, RootState> & Getters = {
  // getAssetTypes: (state) => state.data.entityDefs,
};
