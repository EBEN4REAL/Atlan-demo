import { SubpanelColumnData } from './VQBPanelAggregators.interface'
export interface SubpanelGroupColumn {
    id: string
    tableQualfiedName: string | undefined
    columns: any[]
    columnsData: SubpanelColumnData[]
}
export interface VQBPanelGroupsInterface {
    order: number
    id: string
    hide: boolean
    subpanels: SubpanelGroupColumn[]
}
