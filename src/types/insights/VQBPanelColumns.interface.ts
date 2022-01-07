import { SubpanelColumnData } from './VQBPanelAggregators.interface'
export interface SubpanelColumn {
    id: string
    tableQualfiedName: string | undefined
    columns: string[]
    columnsData: SubpanelColumnData[]
    tableData: {
        certificateStatus: string | undefined
        assetType: string | undefined
    }
}
export interface VQBPanelColumnsInterface {
    order: number
    id: string
    hide: boolean
    subpanels: SubpanelColumn[]
    expand: boolean
}
