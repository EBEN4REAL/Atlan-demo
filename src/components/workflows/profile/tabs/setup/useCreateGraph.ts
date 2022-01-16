import { ref } from 'vue'
import { SimpleNodeView } from './view.js'
import { DagreLayout } from '@antv/layout'

import { Graph } from '@antv/x6'

export default function useCreateGraph(
    graph,
    graphContainer,
    minimapContainer
) {
    const graphLayout = ref({})

    /* Build Graph Canvas */
    // const { Graph } = window.X6
    // const { DagreLayout } = window.layout

    graph.value = new Graph({
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
            zoomAtMousePosition: true,
            maxScale: 1.2,
            enabled: true,
            global: true,
            modifiers: ['ctrl', 'meta'],
        },
        minimap: {
            enabled: true,
            container: minimapContainer.value,
            width: 270,
            height: 160,
            padding: 1,
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
        ranksep: 35,
    })

    return {
        graph,
        graphLayout,
    }
}
