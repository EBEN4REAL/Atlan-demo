import axios from 'axios'
import { computed, ComputedRef, ref, Ref } from 'vue'
import { BasicSearchAttributes, ColumnAttributes } from '~/constant/projection'
import { useBusinessMetadataStore } from '~/store/businessMetadata'
import useAssetSearchList from '~/components/discovery/useSearchList'
import { dataTypeList } from '~/constant/datatype'

const listLimit = 20
// TODO: Cleanup this list, remove unused attributes
const staticColumnAttributes = [
    'description',
    'userDescription',
    'customDescription',
    'owner',
    'expert',
    'files',
    'table',
    'database',
    'atlanSchema',
    'profileSchedule',
    'isProfileScheduled',
    'order',
    'extra',
    'metadata',
    'commits',
    'siteName',
    'siteQualifiedName',
    'topLevelProjectName',
    'topLevelProjectQualifiedName',
    'isTopLevelProject',
    'projectHierarchy',
    'projectName',
    'workbookName',
    'datasourceName',
    ...BasicSearchAttributes,
    ...useBusinessMetadataStore().getBusinessMetadataListProjections,
    ...ColumnAttributes,
]

interface filterConfig {
    parentQfName: Ref<string>
    dataTypes?: Ref<string[]>
    specialColumns?: boolean
}

function getEntityFilters({
    parentQfName,
    dataTypes,
    specialColumns,
}: filterConfig) {
    const baseFilter = {
        condition: 'AND',
        criterion: [
            {
                condition: 'OR',
                criterion: [
                    {
                        attributeName: 'tableQualifiedName',
                        attributeValue: parentQfName.value,
                        operator: 'eq',
                    },
                    {
                        attributeName: 'viewQualifiedName',
                        attributeValue: parentQfName.value,
                        operator: 'eq',
                    },
                ],
            },
        ],
    }
    if (dataTypes?.value?.length)
        baseFilter.criterion.push({
            condition: 'OR',
            criterion: dataTypeList
                .filter((typeList) => dataTypes.value.includes(typeList.id))
                .reduce((acc: string[], dt) => [...acc, ...dt.type], [])
                .map((filter) => ({
                    attributeName: 'dataType',
                    attributeValue: filter,
                    operator: 'eq',
                })),
        })

    return baseFilter
}

export function useColumnsList(
    parentQfName: Ref<string>,
    {
        query = ref(''),
        offset = ref(0),
        dataTypes = ref([] as string[]),
        specialColumns = undefined,
    },
    immediate = true
) {
    const payload = computed(() => ({
        typeName: 'Column',
        excludeDeletedEntities: true,
        includeClassificationAttributes: false,
        includeSubClassifications: false,
        includeSubTypes: false,
        limit: listLimit,
        query: query.value,
        offset: offset.value,
        attributes: staticColumnAttributes,
        entityFilters: getEntityFilters({
            parentQfName,
            dataTypes,
            specialColumns,
        }),
    }))

    const cancelTokenSource = axios.CancelToken.source()

    const {
        replaceBody,
        body,
        list,
        searchScoreList,
        isReady,
        error,
        data,
        refresh,
        mutate,
    } = useAssetSearchList(payload.value, '', immediate, cancelTokenSource)

    const isLoading = computed(() => !isReady.value && !error.value)

    const listCount: ComputedRef<any> = computed(() => list.value?.length)
    const totalCount: ComputedRef<any> = computed(
        () => data?.value?.approximateCount
    )

    const isLoadMore = computed(() => listCount.value < totalCount.value)

    function reFetch() {
        replaceBody({ ...payload.value })
    }

    function loadMore() {
        if (isLoadMore.value) {
            offset.value += listLimit
            reFetch()
        }
    }

    return {
        list,
        isLoading,
        query,
        reFetch,
        loadMore,
        refresh,
        body,
        error,
        isLoadMore,
        searchScoreList,
        mutate,
    }
}

export function useColumnAggregation(
    parentQfName: Ref<string>,
    immediate = true
) {
    const aggregationCancelTokenSource = axios.CancelToken.source()

    const payload = computed(() => ({
        limit: 1,
        offset: 0,
        excludeDeletedEntities: true,
        aggregationAttributes: ['Column.dataType.keyword'],
        typeName: 'Column',
        entityFilters: getEntityFilters({ parentQfName }),
    }))

    const {
        isLoading: isAggregateLoading,
        replaceBody,
        data,
    } = useAssetSearchList(payload, '', immediate, aggregationCancelTokenSource)

    const dataTypeMap: ComputedRef<Record<string, number>> = computed(() => {
        if (data.value?.aggregations) {
            return data.value?.aggregations['Column.dataType.keyword']
        }
        return {}
    })

    const dataTypeSum = computed(() => {
        return Object.values(dataTypeMap.value).reduce(
            (acc, curr) => acc + curr,
            0
        )
    })

    function refreshAggregation() {
        replaceBody(payload)
    }

    return {
        dataTypeMap,
        dataTypeSum,
        isAggregateLoading,
        refreshAggregation,
    }
}
