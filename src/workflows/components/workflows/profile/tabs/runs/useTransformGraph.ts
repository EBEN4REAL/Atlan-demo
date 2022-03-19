export default function useTransformGraph(graph, currZoom, firstNodeId) {
    const zoom = (factor) => {
        graph.value.zoom(factor, { minScale: 0.25, maxScale: 1.2 })
        currZoom.value = graph.value.zoom()
    }

    const fullscreen = (targetEle) => {
        if (document.fullscreenElement) document.exitFullscreen()
        else targetEle.value.requestFullscreen()
    }
    const handleRecenter = () => {
        const cell = graph.value.getCellById(`${firstNodeId.value}`)
        if (cell) graph.value.centerCell(cell, { padding: { top: -300 } })
        // const cell = graph.value.getCellById(firstNodeId.value)
        // if (cell) graph.value.centerCell(cell, { padding: { top: -300 } })
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
