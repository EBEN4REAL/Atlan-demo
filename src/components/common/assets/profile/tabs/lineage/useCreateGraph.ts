import { ref } from 'vue'
import { SimpleNodeView } from './view.js'
import { DagreLayout } from './dagreLayout/dagre'

export default function useCreateGraph(
    graph,
    graphContainer,
    minimapContainer
) {
    const graphLayout = ref({})

    /* Build Graph Canvas */
    const { Graph } = window.X6
    // const { DagreLayout } = window.layout

    graph.value = new Graph({
        autoResize: true,
        interacting: false,
        container: graphContainer.value,
        grid: true,
        background: { color: '#ffffff' },
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
        ranksep: 100,
        nodesep: 15,
        controlPoints: true,
    })

    return {
        graph,
        graphLayout,
    }
}
