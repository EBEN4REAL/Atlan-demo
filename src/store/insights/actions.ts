/* eslint-disable no-unused-vars */
import { assetInterface } from '~/types/assets/asset.interface'
import { State } from './state'

const MAX_PREVIEW_TAB_QUEUE = 6
export interface Actions extends State {
    addPreviewTab(asset: assetInterface): void
    getData: ({
        rows,
        columns,
        executionTime,
        previewTabIndex,
    }: {
        rows: any[]
        columns: any[]
        executionTime: number
        previewTabIndex: number
    }) => void
}

const actions: Actions = {
    // setAllIntegrationsList(list) {
    //     this.allIntegrations = list
    // },
    addPreviewTab(asset: assetInterface) {
        const previewTab = {
            asset: asset,
            rows: [],
            columns: [],
            runQueryId: undefined,
            isQueryRunning: '',
            queryErrorObj: {},
            abortQueryFn: undefined,
            totalRowsCount: -1,
            executionTime: -1,
            eventSourceInstance: undefined,
            buttonDisable: false,
            isQueryAborted: false,
            tabQueryState: false,
            buttonDisable: false,
        }
        if (this.previewTabs.length === MAX_PREVIEW_TAB_QUEUE) {
            this.previewTabs.splice(0, 1)
            this.previewTabs.push(previewTab)
        } else {
            this.previewTabs.push(previewTab)
        }
    },
    getData({ rows, columns, executionTime, previewTabIndex }) {
        this.previewTabs[previewTabIndex].rows = rows
        this.previewTabs[previewTabIndex].columns = columns
        this.previewTabs[previewTabIndex].executionTime = executionTime
    },
}
export default actions
