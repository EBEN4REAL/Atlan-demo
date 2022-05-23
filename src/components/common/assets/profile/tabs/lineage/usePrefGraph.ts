/** VUE */
import { watch } from 'vue'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'

/** UTILS */
import { SQLAssets } from './util.js'

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
        const { showDatabase, showSchema, showAnnouncement } = preferences

        graph.value.getNodes().forEach((node) => {
            const { typeName } = node.store.data
            const isSQLNode = SQLAssets.includes(typeName)
            node.updateData({ showAnnouncement })
            if (!isSQLNode) return
            node.updateData({ showDatabase, showSchema })
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
