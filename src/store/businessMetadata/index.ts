import { defineStore } from "pinia";
import { state } from "./state";
import { actions } from "./actions";
import { getters } from "./getters";


export const useBusinessMetadataStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: "businessMetadata",
  // a function that returns a fresh state
  state: () => state,

  getters,
  // optional actions
  actions,
});
