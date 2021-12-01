import { VQBPanelColumnsInterface } from './VQBPanelColumns.interface'

export interface VQBGenericPanel {
    order: number
    id: string
    hide: boolean
}

export type VQBPanelType = VQBPanelColumnsInterface
export interface VQBInterface {
    panels: VQBPanelType[]
}
