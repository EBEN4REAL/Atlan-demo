export default function useTransformGraph(graph, emit) {
    const zoom = (factor) => {
        graph.value.zoom(factor)
        const currZoom = `${(graph.value.zoom() * 100).toFixed(0)}%`
        emit('on-zoom-change', currZoom)
    }

    const fit = (id) => {
        graph.value.scale(0.7)
        const cell = graph.value.getCellById(id)

        graph.value.positionCell(cell, 'center', {
            padding: { left: 200 },
        })
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
