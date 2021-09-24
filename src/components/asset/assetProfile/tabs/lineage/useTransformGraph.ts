export default function useTransformGraph(graph) {
    const zoom = (factor) => {
        graph.value.zoom(factor)
    }

    const fullscreen = (targetEle) => {
        if (document.fullscreenElement) document.exitFullscreen()
        else targetEle.value.requestFullscreen()
    }

    return {
        zoom,
        fullscreen,
    }
}
