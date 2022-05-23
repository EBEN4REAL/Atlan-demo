/** VUE */
import { watch } from 'vue'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'

export default function useGraph({ graph }) {
    const lineageStore = useLineageStore()
    const preferences = lineageStore.getPreferences()

    // controlEdgesArrow
    const controlEdgesArrow = () => {
        const { showArrow } = preferences
        const size = showArrow ? 12 : 0.1
        graph.value.freeze('showArrow')
        graph.value.getEdges().forEach((edge) => {
            edge.attr('line/targetMarker/height', size)
            edge.attr('line/targetMarker/width', size)
        })
        graph.value.unfreeze('showArrow')
    }

    // controlToggle
    const controlToggle = () => {
        const { showDatabase, showSchema } = preferences

        graph.value.getNodes().forEach((node) => {
            node.updateData({ showDatabase, showSchema })
        })

        const classes = [
            { pref: 'showSchema', className: '.node-schema' },
            { pref: 'showDatabase', className: '.node-database' },
            { pref: 'showAnnouncement', className: '.node-announcement' },
        ]

        classes.forEach((c) => {
            const val = preferences[c.pref]
            const nodesList = document.querySelectorAll(c.className)
            const nodesArr = Array.from(nodesList)
            nodesArr.forEach((n) => {
                if (val) n?.classList.remove('hidden')
                else n?.classList.add('hidden')
            })
        })
    }

    // controlPrefRetainer
    const controlPrefRetainer = () => {
        controlEdgesArrow()
        controlToggle()
    }

    watch(
        preferences,
        () => {
            controlPrefRetainer()
        },
        { deep: true }
    )

    return {
        controlPrefRetainer,
    }
}
