import { computed, ref, toRefs, watch } from 'vue'
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
import {
    AssetAttributes,
    InternalAttributes,
    AssetRelationAttributes,
    GlossaryAttributes,
} from '~/constant/projection'
import useFetchAssetList from '@common/assetList/usefetchAssetList'

export function useGlossaryPopover(term) {
    /**
     * * OPTMIZING THE TERMS POPOVER vvvvv
     */

    const limit = ref(1)
    const offset = ref(0)
    const facets = ref({
        guid: term.guid,
    })

    const dependentKey = ref(facets.value.guid)

    const defaultAttributes = ref([
        ...InternalAttributes,
        ...AssetAttributes,
        ...GlossaryAttributes,
    ])
    const relationAttributes = ref([...AssetRelationAttributes])

    const {
        list: fetchTermArr,
        isLoading,
        isReady,
        error,
    } = useDiscoverList({
        isCache: false,
        dependentKey,
        facets,
        limit,
        offset,
        attributes: defaultAttributes,
        relationAttributes,
    })

    /**
     * * OPTMIZING THE TERMS POPOVER ^^^^^
     */

    const fetchedTerm = computed(() =>
        fetchTermArr.value.length > 0 ? fetchTermArr.value[0] : null
    )

    return {
        isReady,
        term: fetchedTerm,
        isLoading,
        error,
    }
}
