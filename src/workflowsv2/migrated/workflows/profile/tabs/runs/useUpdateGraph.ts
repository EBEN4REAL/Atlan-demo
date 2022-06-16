import { Edge, Graph, Node } from '@antv/x6'
import { Ref } from 'vue'

export default function useUpdateGraph(graph: Ref<Graph>) {
    const resetNodeStyles = () => {
        graph.value.freeze({ key: 'resetNodeStyles' })
        graph.value?.getNodes().forEach((nd) => {
            if (nd.getData()?.isSelected) {
                nd.setData({ isSelected: false })
            }
        })
        graph.value.unfreeze({ key: 'resetNodeStyles' })
    }

    const highlightNode = (
        node?: Node | Node[],
        select = true,
        reset = false
    ) => {
        if (reset) resetNodeStyles()

        if (node)
            if (Array.isArray(node))
                node.forEach((nd) => nd.setData({ isSelected: select }))
            else node.setData({ isSelected: select })
    }

    const setEdgeStyle = (ed: Edge, select = true) => {
        ed.attr('line/stroke', select ? '#5277d7' : '#aaa')
        ed.attr('line/strokeWidth', select ? 2 : 1)
        ed.attr('line/targetMarker/stroke', select ? '#5277d7' : '#aaa')
        ed.attr('line/targetMarker/fill', select ? '#5277d7' : '#aaa')
    }

    const resetEdgeStyles = () => {
        graph.value?.getEdges().forEach((edge) => {
            setEdgeStyle(edge, false)
        })
    }

    const highlightEdge = (
        edge?: Edge | Edge[],
        select = true,
        reset = false
    ) => {
        if (reset) resetEdgeStyles()

        if (edge)
            if (Array.isArray(edge))
                edge.forEach((ed) => setEdgeStyle(ed, select))
            else setEdgeStyle(edge, select)
    }

    const getRecursiveSuccessors = (node: Node) => {
        const nodes: Node[] = graph.value
            .getSuccessors(node, { deep: true })
            .filter((cell) => graph.value.isNode(cell)) as Node[]

        // Add the selected node
        nodes.push(node)

        const edges: Edge[] = nodes.reduce((acc, crNode) => {
            const outEdges = graph.value.getOutgoingEdges(crNode)
            if (outEdges) acc.push(...outEdges)
            return acc
        }, [] as Edge[])

        // Add the outgoing edges from the selected node
        const outEdges = graph.value.getOutgoingEdges(node)
        if (outEdges) edges.push(...outEdges)

        return { nodes, edges }
    }

    const highlightPath = async (node: Node) => {
        const { edges, nodes } = getRecursiveSuccessors(node)
        highlightNode(nodes, true, true)
        highlightEdge(edges, true, true)
    }

    const resetHighlightPath = async () => {
        highlightNode(undefined, false, true)
        highlightEdge(undefined, false, true)
    }

    return {
        highlightNode,
        highlightEdge,
        highlightPath,
        resetHighlightPath,
        getRecursiveSuccessors,
    }
}
