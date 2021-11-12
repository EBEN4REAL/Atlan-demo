import { State } from './state'

export interface Actions extends State {
  appendClassificationList(value: any): void
  setClassificationList(value: any): void
  appendEnumList(value: any): void
  setEnumList(value: any): void
  appendCustomMetadata(value: any): void
  setCustomMetadata(value: any): void

  // From Beta 
  setBusinessMetadataListError(error: string): void;
  // eslint-disable-next-line no-unused-vars
  setBusinessMetadataListLoading(loading: boolean): void;
  // eslint-disable-next-line no-unused-vars
  setBusinessMetadataListLoaded(loading: boolean): void;
  // eslint-disable-next-line no-unused-vars
  businessMetadataAppendToList(value: object): void;
  // eslint-disable-next-line no-unused-vars
  updateBusinessMetadataInList(value: { guid: string }): void;
  // eslint-disable-next-line no-unused-vars
  businessMetadataUpdateBM(value: object): void;
}

export const actions: Actions = {
  appendClassificationList(value) {
    this.classificationList.push(...value)
  },
  setClassificationList(value) {
    this.classificationList = value
  },
  appendEnumList(value) {
    this.enumList.push(...value)
  },
  setEnumList(value) {
    this.enumList = value
  },
  appendCustomMetadata(value) {
    this.customMetadataList.push(...value)
  },
  setCustomMetadata(value) {
    this.customMetadataList = value
  },
  // from Beta 
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
  },
  businessMetadataUpdateBM(bm) {
    const indexOfBmToUpdate = this.businessMetadataList?.findIndex((x) => x.guid === bm.guid)
    if (indexOfBmToUpdate > 0) this.businessMetadataList[indexOfBmToUpdate] = bm
    // console.log("in action", indexOfBmToUpdate);
  },
}
