export interface SubpanelSortColumn {
    label: string
    type: string
    value: string  
    columnQualfiedName: string | undefined

}
export interface SubpanelSort {
    id: string
    column: SubpanelSortColumn
    order: string | undefined
}

export interface VQBPanelSortInterface {
    id: string
    order: number
    hide: boolean
    subpanels: SubpanelSort[]
}