import { ref, Ref, computed, watch } from 'vue'
import bodybuilder from 'bodybuilder'
import useLogsService from './useAccessLogService'
import useBody from './useBody'
import { useConnector } from '~/components/insights/common/composables/useConnector'
import { SourceList } from '~/constant/source'
import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { AssetAttributes, SQLAttributes } from '~/constant/projection'

const { listAccessLogs } = useLogsService()
const { getConnectionName, getConnectorName } = useConnector()
const defaultAttributes = ref([...AssetAttributes, ...SQLAttributes])
export function useAccessLogs(
    gte: Ref<string>,
    lt: Ref<string>,
    from = ref(0),
    size = ref(20)
) {
    const assetListLoading = ref(false)
    const assetMetaMap: Ref<Record<string, any>> = ref({})
    const body = ref<Record<string, any>>({})
    // const from = ref(0)
    // const limit = ref(100)

    const dsl = useBody({
        from: from.value,
        limit: size.value,
        gte: gte.value,
        lt: lt.value,
    })

    body.value = dsl
    const { data, mutate: refetchList, isLoading } = listAccessLogs(body)

    // fetch saved quey meta when data refreshes
    const fetchAssetMeta = (requestBody) => {
        const {
            data: assets,
            error,
            isLoading,
        } = useIndexSearch(
            {
                dsl: { from: 0, size: size.value, ...requestBody },
                attributes: defaultAttributes.value,
            },
            ref('GET_SAVED_QUERY_META'),
            false
        )
        watch(
            isLoading,
            () => {
                assetListLoading.value = isLoading.value
            },
            { immediate: true }
        )
        watch([assetListLoading, error], () => {
            if (!error.value && !assetListLoading.value) {
                if (
                    assets &&
                    assets.value &&
                    assets.value.entities &&
                    assets.value.entities.length
                ) {
                    const newAssets = {}
                    assets.value.entities.forEach((asset) => {
                        const { qualifiedName } = asset.attributes
                        newAssets[qualifiedName] = { ...asset }
                    })
                    assetMetaMap.value = {
                        ...assetMetaMap.value,
                        ...newAssets,
                    }
                }
            }
        })
    }
    watch(
        data,
        () => {
            if (data.value?.hits?.hits?.length) {
                // get saved query logs, if present in the result
                const qualifiedNames = (data.value?.hits?.hits || []).map(
                    (log) => log._source.resource
                )
                // Check if the ids already have cached metadata
                let filteredQFs = []
                if (qualifiedNames && qualifiedNames.length) {
                    filteredQFs = qualifiedNames.filter(
                        (qf) => !assetMetaMap.value.hasOwnProperty(qf)
                    )
                }
                if (filteredQFs && filteredQFs.length) {
                    const base = bodybuilder()
                    filteredQFs.forEach((assetQf) => {
                        const qf = assetQf?.split('/')?.slice(2).join('/')
                        if (qf) base.orFilter('term', 'qualifiedName', qf)
                    })
                    const requestBody = base.build()
                    fetchAssetMeta(requestBody)
                }
            }
        },
        { immediate: true }
    )

    const list = computed(() => {
        if (data.value?.hits?.hits) {
            const logsWithQf = data.value?.hits?.hits.map((log) => {
                const { resource } = log._source
                if (resource) {
                    const qf = resource?.split('/')?.slice(2).join('/')
                    if (qf)
                        return {
                            ...log,
                            _source: { ...log._source, resourceQF: qf },
                        }
                }
                return log
            })
            return logsWithQf ?? []
        }
        return []
    })
    const totalCount = computed(() => size.value + from.value)
    const filteredLogsCount = computed(() => data.value?.hits?.total?.value)
    function mutateBody({
        from,
        size,
        gte,
        lt,
        usernames,
        logStatusValues,
        logActionValues,
        userTypes,
        properties,
        schemaName,
        dbName,
        connectionQF,
        connectorName,
        searchText,
        timezone,
    }) {
        body.value = useBody({
            from: from.value,
            limit: size.value,
            gte,
            lt,
            usernames,
            logStatusValues,
            logActionValues,
            userTypes,
            properties,
            schemaName,
            dbName,
            connectionQF,
            connectorName,
            searchText,
            timezone,
        })
    }
    const paginateLogs = (page: number) => {
        // modify offset
        const offset = (page - 1) * size.value
        from.value = offset
    }
    return {
        list,
        mutateBody,
        refetchList,
        totalCount,
        isLoading,
        filteredLogsCount,
        paginateLogs,
        assetMetaMap,
        assetListLoading,
    }
}
