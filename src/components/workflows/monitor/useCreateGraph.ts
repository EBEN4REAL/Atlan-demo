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
        async: true, // Saves resources and enhances performance.
        autoResize: true,
        interacting: false,
        container: graphContainer.value,
        selecting: {
            enabled: true,
        },
        grid: {
            size: 40,
            visible: true,
            type: 'fixedDot', // 'dot' | 'fixedDot' | 'mesh'
            args: {
                color: '#5278d7', // 网格线/点颜色
                thickness: 2, // 网格线宽度/网格点大小
            },
        },
        background: { color: '#ffffff' },
        scroller: {
            enabled: true,
            pageVisible: false,
            pageBreak: false,
            pannable: true,
        },
        mousewheel: {
            minScale: 0.1,
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
        ranksep: 25,
        nodesep: 60,
        align: 'DR',
        rankDir: 'TB',
    })

    return {
        graph,
        graphLayout,
    }
}
