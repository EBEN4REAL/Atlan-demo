import { State } from './state'

export interface Actions extends State {
  appendClassificationList(value: any): void
  setClassificationList(value: any): void
  appendEnumList(value: any): void
  setEnumList(value: any): void
  appendCustomMetadata(value: any): void
  setCustomMetadata(value: any): void
  updateCustomMetadata(value: object): void;
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
  updateCustomMetadata(bm) {
    const indexOfBmToUpdate = this.customMetadataList?.findIndex((x) => x.guid === bm.guid)
    if (indexOfBmToUpdate > 0) this.customMetadataList[indexOfBmToUpdate] = bm
    // console.log("in action", indexOfBmToUpdate);
  },
}
