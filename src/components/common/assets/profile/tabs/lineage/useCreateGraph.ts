import { NV, BNV } from './view'

export default function useCreateGraph(
    graph,
    graphLayout,
    graphContainer,
    minimapContainer,
    showProcess,
    graphWidth,
    graphHeight
) {
    /* Build Graph Canvas */
    const { Graph } = window.X6
    const { DagreLayout } = window.layout

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
                    if (cell.isEdge()) return null
                },
            },
        },
    })

    /* graphLayout */
    graphLayout.value = new DagreLayout({
        type: 'dagre',
        rankdir: 'LR',
        nodesep: 20,
        controlPoints: true,
        ranksepFunc() {
            if (showProcess.value) return 80
            return 45
        },
    })

    return {
        graph,
        graphLayout,
    }
}
