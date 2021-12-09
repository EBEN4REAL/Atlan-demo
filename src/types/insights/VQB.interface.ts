import { VQBPanelColumnsInterface } from './VQBPanelColumns.interface'
import { VQBPanelAggregatorInterface } from './VQBPanelAggregators.interface'

export type VQBPanelType =
    | VQBPanelColumnsInterface
    | VQBPanelAggregatorInterface
export interface VQBInterface {
    panels: VQBPanelType[]
}
