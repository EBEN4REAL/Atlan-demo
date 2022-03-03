import { Graph, Node } from '@antv/x6'
import { Ref } from 'vue'

export default function useUpdateGraph(graph: Ref<Graph>) {
    const highlightNode = (node?: Node, select = true, reset = false) => {
        if (reset) {
            graph.value.freeze({ key: 'highlightNode' })
            graph.value?.getNodes().forEach((nd) => {
                if (nd.getData()?.isSelected) {
                    nd.setData({ isSelected: false })
                }
            })
            graph.value.unfreeze({ key: 'highlightNode' })
        }
        if (node) node.setData({ isSelected: select })
    }

    return {
        highlightNode,
    }
}
