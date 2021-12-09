export interface SubpanelAggregatorColumn {
    label: string
    type: string
    value: string  
    columnQualfiedName: string | undefined

}
export interface SubpanelAggregator {
    id: string
    column: SubpanelAggregatorColumn[]
    aggregators: any[]
}