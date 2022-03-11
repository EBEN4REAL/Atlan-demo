import { ref, watch } from 'vue'
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
import {
    SQLAttributes,
    AssetRelationAttributes,
    AssetAttributes,
    BasicSearchAttributes,
} from '~/constant/projection'

export default function fetchAsset(guid, extraAttr: string[] = []) {
    const data = ref({})
    const limit = ref(1)
    const offset = ref(0)
    const dependentKey = ref(guid)
    const facets = ref({
        guid,
    })
    const defaultAttributes = ref([
        ...SQLAttributes,
        ...AssetAttributes,
        ...BasicSearchAttributes,
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
