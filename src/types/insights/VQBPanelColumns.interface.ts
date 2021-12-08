export interface SubpanelColumn {
    id: string
    tableQualfiedName: string | undefined
    columns: any[]
    columnsData: []
}
export interface VQBPanelColumnsInterface {
    order: number
    id: string
    hide: boolean
    subpanels: SubpanelColumn[]
}
