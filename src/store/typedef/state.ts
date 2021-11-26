export interface Typedef {
  guid: string
  name: string
  displayName: string
  category?: string
  createdBy: string
  updatedBy: string
  createTime: Date
  updateTime: Date
  description?: string
}

export interface State {
  classificationList: Typedef[]
  customMetadataList: Typedef[]
  enumList: Typedef[]
  isLoading: Boolean
  error: object | null
  forceRevalidate: number
}

export const state: State = {
  classificationList: [] as Typedef[],
  customMetadataList: [] as Typedef[],
  enumList: [] as Typedef[],
  isLoading: false,
  error: null,
  forceRevalidate: 0
}
