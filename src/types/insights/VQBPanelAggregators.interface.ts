export interface SubpanelColumnData {
    label: string
    type: string
    value: string
    columnQualfiedName: string | undefined
}
export interface SubpanelAggregator {
    id: string
    column: SubpanelColumnData
    aggregators: any[]
}

export interface VQBPanelAggregatorsInterface {
    id: string
    order: number
    hide: boolean
    subpanels: SubpanelAggregator[]
}
