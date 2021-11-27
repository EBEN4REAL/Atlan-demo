import { ref } from 'vue'
import { SimpleNodeView } from './view.js'
import useUpdateGraph from './useUpdateGraph'

const { updateProcessNodesPosition } = useUpdateGraph()

export default function useCreateGraph(
    graph,
    graphLayout,
    graphContainer,
    minimapContainer
) {
    /* Build Graph Canvas */
    const { Graph } = window.X6
    const { DagreLayout } = window.layout

    graph.value = new Graph({
        autoResize: true,
        interacting: false,
        container: graphContainer.value,
        grid: true,
        background: { color: '#FAFAFA' },
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

    const isMounted = ref(false)

    /* graphLayout */
    graphLayout.value = new DagreLayout({
        type: 'dagre',
        rankdir: 'LR',
        nodesep: 20,
        controlPoints: true,
        ranksepFunc() {
            if (isMounted.value) return 25
            return 80 // 140
        },
        onLayoutEnd() {
            updateProcessNodesPosition(graph, 110)
            if (!isMounted.value) isMounted.value = true
        },
    })

    return {
        graph,
        graphLayout,
    }
}
