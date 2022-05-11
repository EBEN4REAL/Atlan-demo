/**
 * It takes a graph and an event emitter as input, and returns a set of functions that can be used to transform the graph
 * @param graph - The graph object.
 * @param emit - A function that emits events.
 * @returns The `useTransformGraph` function returns an object with three properties: `zoom`, `fit`, and `fullscreen`.
 */
export default function useTransformGraph(graph, emit) {
    // Zoom
    const zoom = (factor) => {
        graph.value.zoom(factor)
        const currZoom = `${(graph.value.zoom() * 100).toFixed(0)}%`
        emit('on-zoom-change', currZoom)
    }

    // Fit
    const fit = (id) => {
        const cellToFit = graph.value.getCellById(id)
        graph.value.scrollToCell(cellToFit, { animation: { duration: 600 } })
    }

    // Fullscreen
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
