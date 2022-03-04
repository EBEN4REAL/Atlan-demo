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
        graph.value.scale(0.7)

        const cell = graph.value.getCellById(id)
        const pre = graph.value.getPredecessors(cell)
        const suc = graph.value.getSuccessors(cell)
        let position = 'center'
        let padding = { left: 10 }

        if (!pre.length) {
            position = 'left'
            padding = { left: 125 }
        } else if (!suc.length) {
            position = 'right'
            padding = { right: 125 }
        }

        graph.value.positionCell(cell, position, {
            padding,
        })
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
