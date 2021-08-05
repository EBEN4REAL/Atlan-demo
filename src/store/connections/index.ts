import { defineStore } from "pinia";
import { state } from "./state";
import { actions } from "./actions";
import { getters } from "./getters";


export const useConnectionsStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: "connections",
  // a function that returns a fresh state
  state: () => state,

  getters,
  // optional actions
  actions,
});
