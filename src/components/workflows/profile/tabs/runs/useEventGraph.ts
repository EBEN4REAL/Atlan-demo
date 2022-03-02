import { Cell, Model } from '@antv/x6'

export default function useEventGraph({
    graph,
    currZoom,
    isGraphRendered,
    selectedPod,
    drawerVisible,
}) {
    // mousewheel events
    graph.value.on('blank:mousewheel', () => {
        currZoom.value = graph.value.zoom()
    })
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = graph.value.zoom()
    })

    // The graph is rendered asynchronously, so any synchronous
    // interactions need to take place after the render is complete.
    // Once it is complete, change the value of the ref.
    graph.value.on('render:done', () => {
        isGraphRendered.value = true
    })

    graph.value.on(
        'node:selected',
        (args: { cell: Cell; node: Node; options: Model.SetOptions }) => {
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
}
