export interface SubpanelFilterColumn {
    label: string | undefined
    type: string | undefined
    value: string  | undefined
    columnQualfiedName: string | undefined

}
export interface SubpanelFilter {
    id: string
    column: SubpanelFilterColumn
    filter: {
        name: string | undefined    // equal/not_equal...key of filter
        filterType: string | undefined   // and-or
        type: string | undefined// input/multi_input/range_input/none
        value: string | any[] | number | undefined //string, number, [1,2,3], [1, 2]--> from 1 to 2(included)
    }
}

export interface VQBPanelFilterInterface {
    id: string
    order: number
    hide: boolean
    subpanels: SubpanelFilter[]
}