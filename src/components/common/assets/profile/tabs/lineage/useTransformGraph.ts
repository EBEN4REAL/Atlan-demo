/** STORE */
import useLineageStore from '~/store/lineage'

/**
 * It takes a graph and an event emitter as input, and returns a set of functions that can be used to transform the graph
 * @param graph - The graph object.
 * @param emit - A function that emits events.
 * @returns The `useTransformGraph` function returns an object with three properties: `zoom`, `fit`, and `fullscreen`.
 */
export default function useTransformGraph(graph, emit) {
    const lineageStore = useLineageStore()

    // Zoom
    const zoom = (factor) => {
        graph.value.zoom(factor)
        const currZoom = `${(graph.value.zoom() * 100).toFixed(0)}%`
        emit('on-zoom-change', { currZoom, factor })
    }

    // Fit
    const fit = (id) => {
        const cellToFit = graph.value.getCellById(id)
        graph.value.scrollToCell(cellToFit, { animation: { duration: 600 } })
    }

    // controlDimensions
    const controlDimensions = () => {
        const { isSidebar, isFullScreen } = lineageStore
        const sb = isSidebar()
        const fs = isFullScreen()
        const dWidth = window.outerWidth - 60
        const fsWidth = window.outerWidth
        const sbWidth = fs ? window.outerWidth - 420 : window.outerWidth - 480
        // eslint-disable-next-line no-nested-ternary
        const width = sb ? sbWidth : fs ? fsWidth : dWidth
        const height = fs
            ? window.outerHeight / 1.01
            : window.outerHeight / 1.35

        lineageStore.setDimension(width, height)
        graph.value.resize(width, height)
    }

    // Fullscreen
    const fullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
            lineageStore.setFullscreen(false)
        } else {
            const elem = document.documentElement
            elem.requestFullscreen()
            lineageStore.setFullscreen(true)
        }
        controlDimensions()
    }

    return {
        zoom,
        fit,
        fullscreen,
        controlDimensions,
    }
}
