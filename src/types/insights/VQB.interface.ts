import { string } from '~/assets/images/dataType/string.svg'
import { VQBPanelColumnsInterface } from './VQBPanelColumns.interface'
import { VQBPanelAggregatorsInterface } from './VQBPanelAggregators.interface'

export type selectedTables = {
    tableQualifiedName: string
    addedBy: string
}
export type VQBPanelType =
    | VQBPanelColumnsInterface
    | VQBPanelAggregatorsInterface
export interface VQBInterface {
    selectedTables: selectedTables[]
    panels: VQBPanelType[]
}
