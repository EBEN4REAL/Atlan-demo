import dagre from 'dagrejs'
import { Edge, OutNode, DagreLayoutOptions } from './types'
import { isArray, isNumber, isObject, getEdgeTerminal } from './util/index'
import { Base } from './base'

export class DagreLayout extends Base {
    public rankdir: 'TB' | 'BT' | 'LR' | 'RL' = 'TB'

    public align: undefined | 'UL' | 'UR' | 'DL' | 'DR'

    public nodeSize: number | number[] | undefined

    public nodesepFunc: ((d?: any) => number) | undefined

    public ranksepFunc: ((d?: any) => number) | undefined

    public nodesep: number = 50

    public ranksep: number = 50

    public controlPoints: boolean = false

    public sortByCombo: boolean = false

    public edgeLabelSpace: boolean = true

    public keepNodeOrder: boolean = false

    public nodeOrder: string[]

    public preset: {
        nodes: OutNode[]
        edges: any[]
    }

    public nodes: OutNode[] = []

    public edges: Edge[] = []

    public onLayoutEnd: () => void = () => {}

    constructor(options?: DagreLayoutOptions) {
        super()
        this.updateCfg(options)
    }

    public getDefaultCfg() {
        return {
            rankdir: 'TB',
            align: undefined,
            nodeSize: undefined,
            nodesepFunc: undefined,
            ranksepFunc: undefined,
            nodesep: 50,
            ranksep: 50,
            controlPoints: false,
        }
    }

    public layoutNode = (nodeId: string) => {
        const self = this
        const { nodes } = self
        const node = nodes.find((node) => node.id === nodeId)
        if (node) {
            const layout = node.layout !== false
            return layout
        }
        return true
    }

    public execute() {
        const self = this
        const { nodes, nodeSize, rankdir, combos } = self
        if (!nodes) return
        const edges = (self.edges as any[]) || []
        const g = new dagre.graphlib.Graph({
            multigraph: true,
            compound: true,
        })

        let nodeSizeFunc: (d?: any) => number[]
        if (!nodeSize) {
            nodeSizeFunc = (d: any) => {
                if (d.size) {
                    if (isArray(d.size)) {
                        return d.size
                    }
                    if (isObject(d.size)) {
                        return [d.size.width || 40, d.size.height || 40]
                    }
                    return [d.size, d.size]
                }
                return [40, 40]
            }
        } else if (isArray(nodeSize)) {
            nodeSizeFunc = () => nodeSize
        } else {
            nodeSizeFunc = () => [nodeSize, nodeSize]
        }
        let horisep: Function = getFunc(self.nodesepFunc, self.nodesep, 50)
        let vertisep: Function = getFunc(self.ranksepFunc, self.ranksep, 50)

        if (rankdir === 'LR' || rankdir === 'RL') {
            horisep = getFunc(self.ranksepFunc, self.ranksep, 50)
            vertisep = getFunc(self.nodesepFunc, self.nodesep, 50)
        }
        g.setDefaultEdgeLabel(() => ({}))
        g.setGraph(self)

        const comboMap: { [key: string]: boolean } = {}
        nodes
            .filter((node) => node.layout !== false)
            .forEach((node) => {
                const size = nodeSizeFunc(node)
                const verti = vertisep(node)
                const hori = horisep(node)
                const width = node?.isProcess ? 60 : size[0] + 2 * hori
                const height = size[1] + 2 * verti
                const layer = node.layer
                if (isNumber(layer)) {
                    g.setNode(node.id, { width, height, layer })
                } else {
                    g.setNode(node.id, { width, height })
                }

                if (this.sortByCombo && node.comboId) {
                    if (!comboMap[node.comboId]) {
                        comboMap[node.comboId] = true
                        g.setNode(node.comboId, {})
                    }
                    g.setParent(node.id, node.comboId)
                }
            })

        if (this.sortByCombo && combos) {
            combos.forEach((combo) => {
                if (!combo.parentId) return
                if (!comboMap[combo.parentId]) {
                    comboMap[combo.parentId] = true
                    g.setNode(combo.parentId, {})
                }
                g.setParent(combo.id, combo.parentId)
            })
        }

        edges.forEach((edge) => {
            // dagrejs Wiki https://github.com/dagrejs/dagre/wiki#configuring-the-layout
            const source = getEdgeTerminal(edge, 'source')
            const target = getEdgeTerminal(edge, 'target')
            if (this.layoutNode(source) && this.layoutNode(target)) {
                g.setEdge(source, target, {
                    weight: edge.weight || 1,
                })
            }
        })

        let prevGraph: dagre.graphlib.Graph | undefined = undefined
        if (self.preset) {
            prevGraph = new dagre.graphlib.Graph({
                multigraph: true,
                compound: true,
            })
            self.preset.nodes.forEach((node) => {
                prevGraph?.setNode(node.id, node)
            })
        }

        dagre.layout(g, {
            prevGraph,
            edgeLabelSpace: self.edgeLabelSpace,
            keepNodeOrder: self.keepNodeOrder,
            nodeOrder: self.nodeOrder,
        })
        let coord
        g.nodes().forEach((node: any) => {
            coord = g.node(node)
            const i = nodes.findIndex((it) => it.id === node)
            if (!nodes[i]) return
            nodes[i].x = coord.x
            if (nodes[i]?.isProcess) nodes[i].x = coord.x + 110
            nodes[i].y = coord.y
            nodes[i]._order = coord._order
        })
        g.edges().forEach((edge: any) => {
            coord = g.edge(edge)
            const i = edges.findIndex((it) => {
                const source = getEdgeTerminal(it, 'source')
                const target = getEdgeTerminal(it, 'target')
                return source === edge.v && target === edge.w
            })
            if (
                self.edgeLabelSpace &&
                self.controlPoints &&
                edges[i].type !== 'loop'
            ) {
                edges[i].controlPoints = coord.points.slice(
                    1,
                    coord.points.length - 1
                )
            }
        })

        if (self.onLayoutEnd) self.onLayoutEnd()

        return {
            nodes,
            edges,
        }
    }

    public getType() {
        return 'dagre'
    }
}

function getFunc(
    func: ((d?: any) => number) | undefined,
    value: number,
    defaultValue: number
): Function {
    let resultFunc
    if (func) {
        resultFunc = func
    } else if (isNumber(value)) {
        resultFunc = () => value
    } else {
        resultFunc = () => defaultValue
    }
    return resultFunc
}
