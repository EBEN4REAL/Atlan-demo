/** VUE */
import { watch, ref, computed } from 'vue'
import { watchOnce, whenever } from '@vueuse/core'

/** PACKAGES */
import { message } from 'ant-design-vue'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'
import useLineageService from '~/services/meta/lineage/lineage_service'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'
import useGraph from './useGraph'
import fetchColumns from './fetchColumns'

export default function useEventGraph({ graph, lastZoom, currZoom }) {
    // mousewheel events
    graph.value.on('blank:mousewheel', () => {
        lastZoom.value = graph.value.zoom()
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })
    graph.value.on('cell:mousewheel', () => {
        lastZoom.value = graph.value.zoom()
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    // // The graph is rendered asynchronously, so any synchronous
    // // interactions need to take place after the render is complete.
    // // Once it is complete, change the value of the ref.
    graph.value.on('render:done', () => {
        isGraphRendered.value = true
        graph.value.getScrollbarPosition(currentScroll.value)
    })

    graph.value.on(
        'node:selected',
        (args: { cell: Cell; node: Node; options: Model.SetOptions }) => {
            console.log(selectedPod.value)
            console.log(args.cell.id)
            if (args.cell.id === selectedPod.value.id) {
                drawerVisible.value = !drawerVisible.value
            } else if (drawerVisible.value) {
                selectedPod.value = args?.cell?.data
            } else {
                selectedPod.value = args?.cell?.data
                drawerVisible.value = !drawerVisible.value
            }
        }
    )

    // graph.value.on(
    //     'node:unselected',
    //     (args: {
    //         cell: Cell
    //         node: Node
    //         options: Model.SetOptions
    //     }) => {
    //         // console.log(selectedPod.value)
    //         console.log(args?.cell?.id)
    //         // if (args.cell.id === selectedPod.value.id) {
    //         //     drawerVisible.value = !drawerVisible.value
    //         // } else if (drawerVisible.value) {
    //         //     selectedPod.value = args?.cell?.data
    //         // } else {
    //         //     drawerVisible.value = !drawerVisible.value
    //         // }
    //     }
    // )

    isLoadingRefresh.value = false
}
