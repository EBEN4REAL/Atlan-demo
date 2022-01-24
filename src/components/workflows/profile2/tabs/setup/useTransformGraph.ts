export default function useTransformGraph(graph, currZoom) {
    const zoom = (factor) => {
        graph.value.zoom(factor)
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    }

    const fullscreen = (targetEle) => {
        if (document.fullscreenElement) document.exitFullscreen()
        else targetEle.value.requestFullscreen()
    }

    return {
        currZoom,
        zoom,
        fullscreen,
    }
}
