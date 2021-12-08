export interface SubpanelColumn {
    id: string
    tableQualfiedName: string | undefined
    columns: any[]
}
export interface VQBPanelColumnsInterface {
    order: number
    id: string
    hide: boolean
    subpanels: SubpanelColumn[]
}
