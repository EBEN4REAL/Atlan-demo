import { VQBPanelColumnsInterface } from './VQBPanelColumns.interface'
import { VQBPanelAggregatorsInterface } from './VQBPanelAggregators.interface'

export type VQBPanelType =
    | VQBPanelColumnsInterface
    | VQBPanelAggregatorsInterface
export interface VQBInterface {
    panels: VQBPanelType[]
}
