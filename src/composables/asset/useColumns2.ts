import axios from 'axios'
import { Ref, ref, computed, watch, ComputedRef } from 'vue'
import { BasicSearchAttributes, ColumnAttributes } from '~/constant/projection'
import { useBusinessMetadataStore } from '~/store/businessMetadata'
import { dataTypeList } from '~/constant/datatype'
import useAssetSearchList from '~/components/discovery/useSearchList'


export default function useColumns2({
    entityParentQualifiedName,
    immediate = true,

}) {
    const entityFilters = {
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

    const { query, replaceBody, body, list, searchScoreList, isReady, error, data, refresh } =
        useAssetSearchList(
            options,
            '',
            immediate,
            cancelTokenSource
        )

    const isLoading = computed(() => !isReady.value && !error.value)



    const listCount: ComputedRef<any> = computed(() => list.value?.length);
    const totalCount: ComputedRef<any> = computed(() => data?.value?.approximateCount);

    const isLoadMore = computed(() => {
        if (listCount.value < totalCount.value) {
            return true;
        }
        return false;
    });
    /* 
        const loadMore = () => {
            if (isLoadMore.value) {
                options.value.offset += options.value.limit;
            }
            mutate();
        }; */
    watch(entityParentQualifiedName, (newParent, oldParent) => {
        if (newParent !== oldParent) refresh()
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
    }
}
