export interface SubpanelGroupColumn {
    id: string
    tableQualfiedName: string | undefined
    columns: any[]
    columnsData: []
}
export interface VQBPanelGroupsInterface {
    order: number
    id: string
    hide: boolean
    subpanels: SubpanelGroupColumn[]
}
