import { SubpanelColumnData } from './VQBPanelAggregators.interface'
export interface SubpanelColumn {
    id: string
    tableQualfiedName: string | undefined
    columns: string[]
    columnsData: SubpanelColumnData[]
}
export interface VQBPanelColumnsInterface {
    order: number
    id: string
    hide: boolean
    subpanels: SubpanelColumn[]
}
