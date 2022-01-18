export default function useTransformGraph(graph, currZoom, firstNode) {
    const zoom = (factor) => {
        graph.value.zoom(factor)
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    }

    const fullscreen = (targetEle) => {
        if (document.fullscreenElement) document.exitFullscreen()
        else targetEle.value.requestFullscreen()
    }
    const handleRecenter = () => {
        const cell = graph.value.getCellById(firstNode.value.id)
        if (cell) graph.value.centerCell(cell)
        // graph.value.centerPoint(0, 400)
        // graph.value.centerCell(cell)
        // graph.value.centerPoint(null, 800)
        // graph.value.zoom(-0.4)
    }
    return {
        currZoom,
        zoom,
        fullscreen,
        handleRecenter,
    }
}