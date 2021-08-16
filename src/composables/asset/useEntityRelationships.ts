import { computed, ref, watch } from 'vue'
import { useAPI } from '~/api/useAPI'

export default function useEntityRelationships(guid) {
    const relationshipAssets = ref([])
    const isLoading = ref(true)
    const getEntityData = (id: Ref<string>) =>
        useAPI('GET_ENTITY', 'GET', {
            pathVariables: { guid: id?.value || id },
        })
    const { data, error } = getEntityData(guid)

    watch([data, error], () => {
        if (data.value && error.value == undefined) {
            Object.keys(data.value?.entity?.relationshipAttributes).forEach(
                (el) => {
                    const element =
                        data.value?.entity?.relationshipAttributes[el]
                    if (element.length !== 0)
                        relationshipAssets.value.push({
                            displayText: el,
                            length: element.length,
                        })
                }
            )
        } else {
            // if data not found
            console.log(
                error.value,
                '------ failed to fetch entity data------ '
            )
        }
    })
    isLoading.value = false
    return { relationshipAssetTypes: relationshipAssets, isLoading }
}
