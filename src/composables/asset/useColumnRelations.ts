import { useAsyncState } from '@vueuse/core'
import { Ref, watch, ref, computed } from 'vue'
import { fetcher } from '~/api'
import { GET_ASSET_RELATIONSHIP } from '~/api/keyMaps/asset'
import keyMaps from '~/api/keyMaps'
import { dataTypeList } from '~/constant/datatype'

function constructRequest(guid: string) {
    const finalParams = new URLSearchParams()
    const attributes = [
        'name',
        'description',
        'userDescription',
        'customDescription',
        'dataType',
        'isPrimary',
        'order',
        'metadata',
        'relativePinOrder',
        'primary key',
        'assetStatus',
        'tenantId',
    ]

    const paramsObj: any = {
        limit: 1000,
        offset: 0,
        relation: 'columns',
        includeClassificationAttributes: true,
        guid,
        excludeDeletedEntities: true,
    }

    attributes.forEach((val: string) => {
        finalParams.append('attributes', val)
    })
    Object.keys(paramsObj).forEach((key) => {
        finalParams.append(key, paramsObj[key])
    })
    return finalParams
}

export function useColumns(id: Ref<string>) {
    const searchTerm = ref('')
    const filters: Ref<string[]> = ref([])

    const { execute, state, isReady, error } = useAsyncState(
        () => {
            const params = constructRequest(id.value)
            return fetcher(keyMaps[GET_ASSET_RELATIONSHIP](), params, {})
        },
        { entities: [] },
        { resetOnExecute: true }
    )

    const filteredList = computed(() => {
        const allowedTypes = dataTypeList
            .filter((typeList) => filters.value.includes(typeList.id))
            .reduce((acc: string[], dt) => [...acc, ...dt.type], [])
            .map((type) => type.toLowerCase())

        const keyword = searchTerm.value.toLowerCase()

        return (
            state.value?.entities?.filter(
                (item) =>
                    (keyword
                        ? item.displayText.toLowerCase().includes(keyword)
                        : true) &&
                    (filters.value.length
                        ? allowedTypes.includes(
                              item.attributes.dataType.toLowerCase()
                          )
                        : true)
            ) || []
        )
    })

    watch(id, (newId, oldId) => {
        if (newId !== oldId) execute()
    })

    return {
        columnList: state,
        isReady,
        error,
        searchTerm,
        filteredList,
        filters,
    }
}
