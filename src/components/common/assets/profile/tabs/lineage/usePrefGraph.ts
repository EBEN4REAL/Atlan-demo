import { watch } from 'vue'

export default function useGraph({ graph, preferences }) {
    // controlEdgesArrow
    const controlEdgesArrow = () => {
        const val = preferences.value.showArrow
        const size = val ? 12 : 0.1
        graph.value.freeze('showArrow')
        graph.value.getEdges().forEach((edge) => {
            if (edge.id.includes('port')) return
            edge.attr('line/targetMarker/height', size)
            edge.attr('line/targetMarker/width', size)
        })
        graph.value.unfreeze('showArrow')
    }

    // controlSchemaToggle
    const controlSchemaToggle = () => {
        const val = preferences.value.showSchema
        const nodesList = document.querySelectorAll('.node-schema')
        const nodesArr = Array.from(nodesList)
        nodesArr.forEach((n) => {
            if (val) n?.classList.remove('hidden')
            else n?.classList.add('hidden')
        })
    }

    // controlAnnouncementToggle
    const controlAnnouncementToggle = () => {
        const val = preferences.value.showAnnouncement
        const nodesList = document.querySelectorAll('.node-announcement')
        const nodesArr = Array.from(nodesList)
        nodesArr.forEach((n) => {
            if (val) n?.classList.remove('hidden')
            else n?.classList.add('hidden')
        })
    }

    // controlPrefRetainer
    const controlPrefRetainer = () => {
        controlEdgesArrow()
        controlSchemaToggle()
        controlAnnouncementToggle()
    }

    watch(
        () => preferences.value.showArrow,
        () => {
            controlEdgesArrow()
        }
    )

    watch(
        () => preferences.value.showSchema,
        () => {
            controlSchemaToggle()
        }
    )
    watch(
        () => preferences.value.showAnnouncement,
        () => {
            controlAnnouncementToggle()
        }
    )

    return {
        controlPrefRetainer,
    }
}
