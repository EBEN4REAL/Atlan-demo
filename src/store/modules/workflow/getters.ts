import { GetterTree } from "vuex";
import { Components } from "~/api/atlas/client";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

import { State } from "./state";

export type Getters = {
  getConnectionList(state: State): Components.Schemas.AtlasEntityDef[] | null;
};

export const getters: GetterTree<State, RootState> & Getters = {
  getConnectionList: (state) => state.data.entities,
};
