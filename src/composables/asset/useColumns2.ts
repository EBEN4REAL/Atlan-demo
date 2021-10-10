import axios from 'axios'
import { computed, ComputedRef, ref, Ref } from 'vue'
import { BasicSearchAttributes, ColumnAttributes } from '~/constant/projection'
import useBusinessMetadataStore from '~/store/businessMetadata'
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
interface ColumnListConfig {
    query?: Ref<string>
    dataTypes?: Ref<string[]>
    sort?: Ref<string>
    certification?: Ref<string[]>
    /** Set it to `true` to only fetch pinned columns,
     *  `false` to fetch only normal columns,
     *  `undefined`(not pass any value) to fetch all columns
     *  */
    pinned?: boolean

    /*     In case the column guid is present in the profile url */
    columnGuid?: Ref<string>
}
interface filterConfig extends ColumnListConfig {
    parentQfName: Ref<string>
}

function getEntityFilters({ parentQfName, dataTypes, pinned, certification, columnGuid }: filterConfig) {
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
    if (certification?.value?.length)
        baseFilter.criterion.push({
            condition: 'OR',
            criterion: certification.value.map((filter) => ({
                attributeName: 'assetStatus',
                attributeValue: filter,
                operator: 'eq',
            })),
        })
    if (pinned !== undefined) {
        baseFilter.criterion.push({
            // we use AND when pinned = false because we wan't all the pinned related attributes to be false
            condition: pinned ? 'OR' : 'AND',
            criterion: [
                {
                    attributeName: 'isPrimary',
                    attributeValue: `${pinned}`,
                    operator: 'eq',
                },
                {
                    attributeName: 'isPartition',
                    attributeValue: `${pinned}`,
                    operator: 'eq',
                },
            ],
        })
    }
    if (columnGuid?.value !== undefined) {
        baseFilter.criterion.push({
            condition: 'OR',
            criterion: [
                {
                    attributeName: '__guid',
                    attributeValue: `${columnGuid.value}`,
                    operator: 'eq',
                },
            ],
        })
    }

    return baseFilter
}

export function useColumnsList(
    parentQfName: Ref<string>,
    {
        query = ref(''),
        dataTypes = ref([] as string[]),
        pinned,
        sort = ref('Column.order|ascending'),
        certification = ref([] as string[]),
        columnGuid,
    }: ColumnListConfig,
    immediate = true
) {
    const offset = ref(0)

    const split = computed(() => sort.value.split('|'))


    const payload = computed(() => ({
        typeName: 'Column',
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: false,
        includeSubTypes: false,
        limit: pinned ? 100 : listLimit,
        query: query.value,
        sortBy: split.value[0],
        sortOrder: split.value[1].toUpperCase(),
        offset: offset.value,
        attributes: staticColumnAttributes,
        entityFilters: getEntityFilters({
            parentQfName,
            dataTypes,
            pinned,
            certification,
            columnGuid,
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

    const listCount = computed(() => list.value?.length)
    const totalCount = computed(() => data?.value?.approximateCount)

    const isLoadMore = computed(() => listCount.value < totalCount.value)

    function reFetch() {
        offset.value = 0
        replaceBody({ ...payload.value })
    }

    function loadMore() {
        if (isLoadMore.value) {
            offset.value += listLimit
            replaceBody({ ...payload.value })
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
