export default function useTransformGraph(graph, emit) {
    const zoom = (factor) => {
        graph.value.zoom(factor)
        const currZoom = `${(graph.value.zoom() * 100).toFixed(0)}%`
        emit('on-zoom-change', currZoom)
    }

    const fit = (id) => {
        graph.value.zoomToFit({ padding: 12 })
        graph.value.scale(0.5)
        const cell = graph.value.getCellById(id)
        graph.value.centerCell(cell, { padding: { right: 400, bottom: 400 } })
    }

    const fullscreen = (targetEle) => {
        if (document.fullscreenElement) document.exitFullscreen()
        else targetEle.value.requestFullscreen()
    }

    return {
        zoom,
        fit,
        fullscreen,
    }
}
