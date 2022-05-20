/** VUE */
import { watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'

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
