export default function useTransformGraph(graph, emit) {
    const zoom = (factor) => {
        graph.value.zoom(factor)
        const currZoom = `${(graph.value.zoom() * 100).toFixed(0)}%`
        emit('on-zoom-change', currZoom)
    }

    const fit = (id) => {
        graph.value.scale(1)

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
