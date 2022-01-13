import { NV, BNV } from './view'

export default function useCreateGraph(
    graph,
    graphLayout,
    graphContainer,
    minimapContainer,
    graphWidth,
    graphHeight
) {
    /* Build Graph Canvas */
    const { Graph } = window.X6
    const { DagreLayout } = window.layout

    Graph.registerConnector(
        'beiz',
        (s, t) => {
            const control = 65
            const v1 = { x: s.x + control, y: s.y }
            const v2 = { x: t.x - control, y: t.y }

            return `M ${s.x} ${s.y}
             C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${t.x} ${t.y}
            `
        },
        true
    )

    graph.value = new Graph({
        autoResize: true,
        interacting: false,
        container: graphContainer.value,
        grid: true,
        background: { color: '#f8f8f8' },
        height: graphHeight.value / 1.35,
        width: graphWidth.value,
        scroller: {
            enabled: true,
            pageVisible: false,
            pageBreak: true,
            pannable: true,
        },
        mousewheel: {
            minScale: 0.5,
            maxScale: 1.2,
            enabled: true,
            global: true,
            modifiers: ['ctrl', 'meta'],
        },
        minimap: {
            enabled: true,
            container: minimapContainer.value,
            width: 226,
            height: 105,
            padding: 6,
            graphOptions: {
                async: true,
                getCellView(cell) {
                    if (cell.store.data.isBase) return BNV
                    if (cell.isNode()) return NV
                },
                createCellView(cell) {
                    if (!cell.isNode()) return null
                },
            },
        },
    })

    Graph.registerPortLayout(
        'erPortPosition',
        (portsPositionArgs) =>
            portsPositionArgs.map((_, index) => ({
                position: {
                    x: 1,
                    y: (index + 1) * 40 + 40,
                },
                angle: 0,
            })),
        true
    )

    /* graphLayout */
    graphLayout.value = new DagreLayout({
        type: 'dagre',
        rankdir: 'LR',
        controlPoints: true,
        nodesepFunc() {
            // vertical spacing btw nodes
            return 20
        },
        ranksepFunc() {
            // horizontal spacing btw nodes
            return 160
        },
    })

    return {
        graph,
        graphLayout,
    }
}
