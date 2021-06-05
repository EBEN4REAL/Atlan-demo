import { GetterTree } from "vuex";
import { Components } from "~/api/atlas/client";

// eslint-disable-next-line import/no-cycle
import { RootState } from "~/store";

import { State } from "./state";

export type Getters = {
  getDisplayName(state: State): string | "";
  getDisplayNameHTML(state: State): string | "";
  getRealmName(state: State): string | "";
};

export const getters: GetterTree<State, RootState> & Getters = {
  getDisplayName: (state) => state.data.displayName,
  getDisplayNameHTML: (state) => state.data.displayNameHtml,
  getRealmName: (state) => state.data.id,
};
