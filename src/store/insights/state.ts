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
    eventSourceInstance: any
    isQueryAborted: boolean
    tabQueryState: boolean
    buttonDisable: boolean
}

export interface State {
    activePreviewGuid: undefined | string
    previewTabs: PreviewTabs[]
}

export const state: State = {
    activePreviewGuid: undefined,
    previewTabs: [],
}
