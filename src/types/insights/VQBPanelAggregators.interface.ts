export interface SubpanelAggregator {
    id: string
    columnName: string | undefined
    columnQualifiedName: string | undefined
    columnType: string | undefined
    aggregators: any[]
}
export interface VQBPanelAggregatorInterface {
    id: string
    hide: boolean
    subpanels: SubpanelAggregator[]
}
