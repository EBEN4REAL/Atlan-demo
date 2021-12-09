export interface SubpanelColumn {
    id: string
    tableQualfiedName: string | undefined
    columns: string[]
    columnsData: Array<{
        columnsQualifiedName: string
        label: string
        type: Number
    }>
}
export interface VQBPanelColumnsInterface {
    order: number
    id: string
    hide: boolean
    subpanels: SubpanelColumn[]
}
