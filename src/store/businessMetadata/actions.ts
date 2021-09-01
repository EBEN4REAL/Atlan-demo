import { Getters } from "./getters";
import { State } from "./state";

export interface Actions extends State, Getters {
  setData(businessMetadataList: []): void;
  setBusinessMetadataListError(error: string): void;
  setBusinessMetadataListLoading(loading: boolean): void;
  setBusinessMetadataListLoaded(loading: boolean): void;
  businessMetadataAppendToList(value: object): void;
  updateBusinessMetadataInList(value: { guid: string }): void;
}

export const actions: Actions = {
  setData(businessMetadataList) {
    this.businessMetadataList = businessMetadataList;
  },
  setBusinessMetadataListError(error) {
    this.businessMetadataListError = error;
  },
  setBusinessMetadataListLoading(loading) {
    this.businessMetadataListLoading = loading;
  },
  setBusinessMetadataListLoaded(loaded) {
    this.businessMetadataListLoaded = loaded;
  },
  businessMetadataAppendToList(value: { guid: string }) {
    if (this.businessMetadataList) {
      this.businessMetadataList = [value, ...this.businessMetadataList];
    }
  },
  updateBusinessMetadataInList(value: { guid: string }) {
    if (this.businessMetadataList) {
      this.businessMetadataList = this.businessMetadataList.map(
        (item: { guid: string }) => {
          if (item.guid === value.guid) {
            return { ...item, ...value };
          }
          return item;
        }
      );
    }
  }
};
