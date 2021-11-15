import { ref, Ref, watch, computed } from 'vue'

import { assetInterface } from '~/types/assets/asset.interface'

import useIndexSearch from './useIndexSearch'
import { assetTypeList } from '~/constant/assetType'
import useAssetStore from '~/store/asset'
import { useBody } from './useBody'
import useGlossaryStore from '~/store/glossary'
import {
    AssetAttributes,
    AssetRelationAttributes,
    InternalAttributes,
    SQLAttributes,
} from '~/constant/projection'

interface DiscoverListParams {
    id: Ref<string>
    attributes?: Ref<string[]>
    relationAttributes?: Ref<string[]>
}

export function useCurrentUpdate({ id }: DiscoverListParams) {
    const defaultBody = ref({})

    const defaultAttributes = ref([
        ...InternalAttributes,
        ...AssetAttributes,
        ...SQLAttributes,
    ])
    const relationAttributes = ref([...AssetRelationAttributes])

    const generateBody = () => {
        const dsl = useBody('', 0, 1, { guid: id }, {}, [], {})
        defaultBody.value = {
            dsl,
            attributes: defaultAttributes?.value,
            relationAttributes: relationAttributes?.value,
        }
    }

    const localKey = ref(id.value)

    generateBody()
    const {
        data,
        isLoading,
        isValidating,
        aggregationMap,
        mutate,
        cancelRequest,
        error,
        isReady,
    } = useIndexSearch<assetInterface>(defaultBody, localKey, false, false, 1)

    const asset = ref<assetInterface[]>([])
    watch(data, () => {
        if (data.value?.entities?.length > 0) {
            asset.value = data?.value?.entities[0]
        }
    })

    // const handleSelectedAsset = (item) => {
    //     assetStore.setSelectedAsset(item)
    // }
    // const selectedAsset = computed(() => assetStore.selectedAsset)

    // const handleSelectedGlossary = (item) => {
    //     glossaryStore.setSelectedGlossary(item)
    // }
    // const selectedGlossary = computed(() => glossaryStore.selectedGlossary)

    return {
        aggregationMap,
        isValidating,
        isLoading,
        data,
        fetch,
        cancelRequest,
        mutate,
        // handleSelectedAsset,
        // selectedAsset,
        // handleSelectedGlossary,
        // selectedGlossary,
        error,
        asset,
        isReady,
    }
}