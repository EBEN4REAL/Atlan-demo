import { assetInterface } from '~/types/assets/asset.interface'
export interface PreviewTabs {
    asset: assetInterface
    rows: any[]
    columns: any[]
    isQueryRunning: string
    runQueryId: string | undefined
    abortQueryFn: Function | undefined
    queryErrorObj: Object
    totalRowsCount: number
    executionTime: number
    sourceExecutionTime: number
    eventSourceInstance: any
    isQueryAborted: boolean
    tabQueryState: boolean
    buttonDisable: boolean
}

export interface State {
    activePreviewGuid: undefined | string
    previewTabs: PreviewTabs[]
    isNewTabAdded: Number
    insertionType: 'LIFO' | 'FILO'
}

export const state: State = {
    activePreviewGuid: undefined,
    previewTabs: [],
    isNewTabAdded: -1,
    insertionType: 'FILO',
}
