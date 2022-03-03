/* eslint-disable no-param-reassign */
import { Cell, Graph, Model, Node } from '@antv/x6'
import { Ref } from 'vue'
import useUpdateGraph from './useUpdateGraph'

interface EventParams {
    graph: Ref<Graph>
    currZoom: Ref<number>
    isGraphRendered: Ref<boolean>
    selectedPod: Ref<Record<string, any>>
    drawerVisible: Ref<boolean>
}

export default function useEventGraph({
    graph,
    currZoom,
    isGraphRendered,
    selectedPod,
    drawerVisible,
}: EventParams) {
    const { highlightNode } = useUpdateGraph(graph)

    // mousewheel events
    graph.value.on('blank:mousewheel', () => {
        currZoom.value = graph.value.zoom()
    })

    graph.value.on('cell:mousewheel', () => {
        currZoom.value = graph.value.zoom()
    })

    graph.value.on('blank:click', () => {
        drawerVisible.value = false
    })

    // The graph is rendered asynchronously, so any synchronous
    // interactions need to take place after the render is complete.
    // Once it is complete, change the value of the ref.
    graph.value.on('render:done', () => {
        isGraphRendered.value = true
    })

    graph.value.on(
        'node:click',
        (args: { cell: Cell; node: Node; options: Model.SetOptions }) => {
            if (args.cell.id === selectedPod.value.id) {
                drawerVisible.value = !drawerVisible.value
            } else if (drawerVisible.value) {
                selectedPod.value = args?.cell?.data
            } else {
                selectedPod.value = args?.cell?.data
                drawerVisible.value = !drawerVisible.value
            }

            highlightNode(args.node, drawerVisible.value, true)
        }
    )

    graph.value.on(
        'node:unselected',
        (args: { cell: Cell; node: Node; options: Model.SetOptions }) => {
            highlightNode(args.node, false)
        }
    )
}
