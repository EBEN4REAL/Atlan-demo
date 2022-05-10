/** VUE */
import { watch } from 'vue'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'

export default function useGraph({ graph }) {
    const lineageStore = useLineageStore()
    const preferences = lineageStore.getPreferences()

    // controlEdgesArrow
    const controlEdgesArrow = () => {
        const val = preferences.showArrow
        const size = val ? 12 : 0.1
        graph.value.freeze('showArrow')
        graph.value.getEdges().forEach((edge) => {
            edge.attr('line/targetMarker/height', size)
            edge.attr('line/targetMarker/width', size)
        })
        graph.value.unfreeze('showArrow')
    }

    // controlToggle
    const controlToggle = () => {
        const classes = [
            { pref: 'showSchema', className: '.node-schema' },
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
