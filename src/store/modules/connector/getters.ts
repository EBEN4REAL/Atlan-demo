import { GetterTree } from "vuex";
import { Components } from "~/api/atlas/client";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

import { State } from "./state";

export type Getters = {
  getConnectorList(state: State): any[];
};

export const getters: GetterTree<State, RootState> & Getters = {
  getConnectorList: (state) => state.data.entities
};
