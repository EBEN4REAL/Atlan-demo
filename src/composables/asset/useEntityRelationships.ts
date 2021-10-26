import { computed, ref, watch } from 'vue'
import { useAPI } from '~/services/api/useAPI'

export default function useEntityRelationships(guid) {
    const relationshipAssets = ref([])
    const getEntityData = (id: Ref<string>) =>
        useAPI('GET_ENTITY', 'GET', {
            pathVariables: { guid: id?.value || id },
        })
    const { data, error, isLoading } = getEntityData(guid)

    watch([data, error], () => {
        if (data.value && error.value == undefined) {
            Object.keys(data.value?.entity?.relationshipAttributes).forEach(
                (el) => {
                    const element =
                        data.value?.entity?.relationshipAttributes[el]
                    if (element && element?.length !== 0 && element.typeName !== "Schema")
                        relationshipAssets.value.push({
                            displayText: el,
                            length: element?.length || 1,
                        })
                }
            )
            console.log(relationshipAssets.value)
        } else {
            // if data not found
            console.log(
                error.value,
                '------ failed to fetch entity data------ '
            )
        }
    })
    return { relationshipAssetTypes: relationshipAssets, isLoading }
}
