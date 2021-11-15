import { ref } from 'vue'
import { SimpleNodeView } from './view.js'

export default function useCreateGraph(
    graph,
    graphContainer,
    minimapContainer
) {
    const graphLayout = ref({})

    /* Build Graph Canvas */
    const { Graph } = window.X6
    const { DagreLayout } = window.layout

    graph.value = new Graph({
        container: graphContainer.value,
        grid: true,
        background: { color: '#f8f8fd' },
        scroller: {
            enabled: true,
            pageVisible: false,
            pageBreak: false,
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
            width: 165,
            height: 105,
            padding: 6,
            graphOptions: {
                async: true,
                getCellView(cell) {
                    if (cell.isNode()) return SimpleNodeView
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
        // align: 'UR',
        ranksep: 80,
        nodesep: 10,

        controlPoints: true,
    })

    return {
        graph,
        graphLayout,
    }
}
