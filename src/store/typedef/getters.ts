import { State } from './state'


export type Getters = {
  getCustomMetadataList(state: State): object[] | null,
  getForceRevalidate(state: State): number,
};

export const getters: Getters = {
  getCustomMetadataList(state: State) {
    return state.customMetadataList;
  },
  getForceRevalidate(state: State) {
    return state.forceRevalidate;
  },
}
