import { ClassificationInterface } from '~/types/classifications/classification.interface'

import { State } from './state'
 
export interface Actions extends State {
  appendClassificationList(value: any): void
  setClassificationList(value: any): void
  appendEnumList(value: any): void
  setEnumList(value: any): void
  appendCustomMetadata(value: any): void
  setCustomMetadata(value: any): void
  updateCustomMetadata(value: object): void;
  setIsLoading(value: boolean): void
  setError(value: object | null): void
  updateSingleClassification(value: ClassificationInterface): void
  removeClassificationByName(name: string): void
  tickForceRevalidate(): void,
}

export const actions: Actions = {
  // classiffication
  appendClassificationList(value) {
    this.classificationList.push(...value)
  },
  setClassificationList(value) {
    this.classificationList = value
  },
  updateSingleClassification(value: ClassificationInterface) {
    this.classificationList = this.classificationList.map((classification) => {
      if(classification.name === value.name) {
        return value
      }
      return classification
    })
  },
  removeClassificationByName(name: string) {
    this.classificationList = this.classificationList.filter((classification) => classification.name !== name)
  },
  // enum list
  appendEnumList(value) {
    this.enumList.push(...value)
  },
  setEnumList(value) {
    this.enumList = value
  },
  // custom metadata
  appendCustomMetadata(value) {
    this.customMetadataList.push(...value)
  },
  setCustomMetadata(value) {
    this.customMetadataList = value
  },
  updateCustomMetadata(bm) {
    const indexOfBmToUpdate = this.customMetadataList?.findIndex((x) => x.guid === bm.guid)
    if (indexOfBmToUpdate > -1) this.customMetadataList[indexOfBmToUpdate] = bm
  },
  // states updates 
  setIsLoading(value) {
    this.isLoading = value
  },
  setError(value) {
    this.error = value
  },
  tickForceRevalidate() {
    this.forceRevalidate += 1
  }
}
