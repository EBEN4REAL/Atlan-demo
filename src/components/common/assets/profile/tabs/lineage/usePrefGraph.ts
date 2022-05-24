/** VUE */
import { watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'

/** UTILS */
import { SQLAssets } from './util.js'

export default function useGraph({ graph }) {
    const lineageStore = useLineageStore()
    const preferences = lineageStore.getPreferences()

    /** EVENT DEFINITIONS */
    const sendDisplayPreferenceEvent = useDebounceFn((option, is_enabled) => {
        useAddEvent('lineage', 'control_panel_display_preference', 'updated', {
            option,
            is_enabled,
        })
    }, 600)

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
        () => ({ ...preferences }),
        (newVal, oldVal) => {
            controlPrefRetainer()

            // Handle Event - lineage_control_panel_full_screen_toggled
            // eslint-disable-next-line no-restricted-syntax
            for (const key in newVal) {
                if (newVal[key] !== oldVal[key]) {
                    sendDisplayPreferenceEvent(
                        key.replace('show', '').toLowerCase(),
                        newVal[key]
                    )

                    break
                }
            }
        }
    )

    return {
        controlPrefRetainer,
    }
}
