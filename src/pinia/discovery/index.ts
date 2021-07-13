import { state } from "./state";
import { actions } from "./actions";
import { getters } from "./getters";

import { defineStore } from "pinia";

export const useDiscoveryStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: "discovery",
  // a function that returns a fresh state
  state: () => state,

  getters: getters,
  // optional actions
  actions: actions,
});
