import { ref } from 'vue'
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import { SimpleNodeView } from './view.js'

export default function useCreateGraph(graph, container, minimapContainer) {
    const graphLayout = ref({})

    /* Build Graph Canvas */
    graph.value = new Graph({
        container: container.value,
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
            width: 200,
            height: 160,
            padding: 10,
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
        align: 'UR',
        ranksep: 80,
        nodesep: 10,
        controlPoints: true,
    })

    return {
        graph,
        graphLayout,
    }
}
