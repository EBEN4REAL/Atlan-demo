export interface Node {
    id: string
}

export interface OutNode extends Node {
    x: number
    y: number
    comboId?: string
    layer?: number
    _order?: number
    layout?: boolean
}

export interface Edge {
    source: string
    target: string
}

export interface Combo {
    id: string
    parentId?: string
}

export interface Model {
    nodes?: Node[]
    edges?: Edge[]
    combos?: Combo[]
}

export type PointTuple = [number, number]

export interface DagreLayoutOptions {
    type: 'dagre'
    rankdir?: 'TB' | 'BT' | 'LR' | 'RL'
    align?: 'UL' | 'UR' | 'DL' | 'DR'
    nodeSize?: number | number[] | undefined
    nodesep?: number
    ranksep?: number
    nodesepFunc?: ((d?: any) => number) | undefined
    ranksepFunc?: ((d?: any) => number) | undefined
    controlPoints?: boolean
    sortByCombo?: boolean
    workerEnabled?: boolean
    onLayoutEnd?: () => void
    edgeLabelSpace?: boolean
    keepNodeOrder?: boolean
    nodeOrder?: string[]
}
