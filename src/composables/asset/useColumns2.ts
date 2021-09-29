import axios from 'axios'
import { computed, ComputedRef } from 'vue'
import { BasicSearchAttributes, ColumnAttributes } from '~/constant/projection'
import { useBusinessMetadataStore } from '~/store/businessMetadata'
import useAssetSearchList from '~/components/discovery/useSearchList'

function getEntityFilters(entityParentQualifiedName: string) {
    return {
        condition: 'OR',
        criterion: [
            {
                attributeName: 'tableQualifiedName',
                attributeValue: entityParentQualifiedName,
                operator: 'eq',
            },
            {
                attributeName: 'viewQualifiedName',
                attributeValue: entityParentQualifiedName,
                operator: 'eq',
            },
        ],
    }
}

export function useColumns2({ entityParentQualifiedName, immediate = true }) {
    const entityFilters = getEntityFilters(entityParentQualifiedName.value)

    const options = {
        typeName: 'Column',
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 20,
        offset: 0,
        attributes: [
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
        ],
        entityFilters,
    }

    const cancelTokenSource = axios.CancelToken.source()

    const {
        query,
        replaceBody,
        body,
        list,
        searchScoreList,
        isReady,
        error,
        data,
        refresh,
        mutate,
    } = useAssetSearchList(options, '', immediate, cancelTokenSource)

    const isLoading = computed(() => !isReady.value && !error.value)

    const listCount: ComputedRef<any> = computed(() => list.value?.length)
    const totalCount: ComputedRef<any> = computed(
        () => data?.value?.approximateCount
    )

    const isLoadMore = computed(() => {
        if (listCount.value < totalCount.value) {
            return true
        }
        return false
    })

    return {
        list,
        isLoading,
        query,
        replaceBody,
        refresh,
        body,
        error,
        isLoadMore,
        searchScoreList,
        mutate,
    }
}

export function useColumnAggregation({
    entityParentQualifiedName,
    immediate = true,
}) {
    const aggregationCancelTokenSource = axios.CancelToken.source()
    const entityFilters = getEntityFilters(entityParentQualifiedName.value)

    const baseQuery = {
        limit: 1,
        offset: 0,
        excludeDeletedEntities: true,
        aggregationAttributes: ['Column.dataType.keyword'],
        typeName: 'Column',
        entityFilters,
    }

    const {
        isLoading: isAggregateLoading,
        replaceBody,
        data,
    } = useAssetSearchList(
        baseQuery,
        '',
        immediate,
        aggregationCancelTokenSource
    )

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

    function refreshAggregation(newBody: any) {
        replaceBody({
            ...baseQuery,
            ...newBody,
        })
    }

    return {
        dataTypeMap,
        dataTypeSum,
        isAggregateLoading,
        refreshAggregation,
    }
}
