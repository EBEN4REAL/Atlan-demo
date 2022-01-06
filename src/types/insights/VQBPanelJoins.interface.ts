import { SubpanelColumnData } from './VQBPanelAggregators.interface'
export interface SubpanelJoin {
    id: string
    columnsDataLeft: SubpanelColumnData
    columnsDataRight: SubpanelColumnData
    joinType: {
        type: string
        name: string
    }
}
export interface VQBPanelJoinsInterface {
    order: number
    id: string
    hide: boolean
    subpanels: SubpanelJoin[]
    expand: boolean
}
