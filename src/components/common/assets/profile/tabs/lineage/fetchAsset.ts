import { ref, watch } from 'vue'
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
import useTypedefData from '~/composables/typedefs/useTypedefData'
import {
    InternalAttributes,
    SQLAttributes,
    AssetRelationAttributes,
} from '~/constant/projection'

export default function fetchAsset(guid, extraAttr: string[] = []) {
    const { customMetadataProjections } = useTypedefData()

    const data = ref({})
    const limit = ref(1)
    const offset = ref(0)
    const dependentKey = ref(guid)
    const facets = ref({
        guid,
    })
    const defaultAttributes = ref([
        ...InternalAttributes,
        ...SQLAttributes,
        ...customMetadataProjections,
        ...extraAttr,
    ])
    const relationAttributes = ref([...AssetRelationAttributes])
    const { list } = useDiscoverList({
        isCache: false,
        dependentKey,
        facets,
        limit,
        offset,
        attributes: defaultAttributes,
        relationAttributes,
    })
    watch(list, () => {
        data.value = list.value[0]
    })

    return {
        data,
    }
}
