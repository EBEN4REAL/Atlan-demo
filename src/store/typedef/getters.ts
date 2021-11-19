import { State } from './state'


export type Getters = {
  getCustomMetadataList(state: State): object[] | null,
};

export const getters: Getters = {
  getCustomMetadataList(state: State) {
    return state.customMetadataList;
  },
}
