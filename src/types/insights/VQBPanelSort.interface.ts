import { SubpanelColumnData } from './VQBPanelAggregators.interface'
export interface SubpanelSort {
    id: string
    column: SubpanelColumnData
    aggregateORGroupColumn: SubpanelColumnData & { addedBy: string }
    order: string | undefined
}

export interface VQBPanelSortInterface {
    id: string
    order: number
    hide: boolean
    subpanels: SubpanelSort[]
    expand: boolean
}
