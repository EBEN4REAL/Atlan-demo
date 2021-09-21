import { Ref, ref, computed, watch, ComputedRef } from 'vue'
import { BasicSearchAttributes, ColumnAttributes } from '~/constant/projection'
import { SearchBasic } from '~/api/atlas/searchbasic'
import { useBusinessMetadataStore } from '~/store/businessMetadata'
import { dataTypeList } from '~/constant/datatype'
import { SearchParameters } from "~/types/atlas/attributes";

export default function useColumns2({
    entityParentQualifiedName,
    isUpdateStatus = true,
    fetchRelationships = false
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

    const options: Ref<SearchParameters> = ref({
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
    })


    const searchTerm = ref('')
    const filters: Ref<string[]> = ref([])

    const { data, error, mutate, isValidating, isLoading } = SearchBasic.BasicV2(
        '',
        options
    )

    const list: Ref<any[]> = ref([]);
    watch(data, () => {
        if (options?.value?.offset > 0) {
            list.value = list.value.concat(data?.value?.entities);

        } else if (data.value?.entities) {
            list.value = data.value?.entities;

        } else {
            list.value = [];
        }
    });


    const filteredList = computed(() => {
        const allowedTypes = dataTypeList
            .filter((typeList) => filters.value.includes(typeList.id))
            .reduce((acc: string[], dt) => [...acc, ...dt.type], [])
            .map((type) => type.toLowerCase())

        const keyword = searchTerm.value.toLowerCase()

        return (
            data.value?.entities.filter(
                (item) =>
                    (keyword
                        ? item.displayText?.toLowerCase().includes(keyword)
                        : true) &&
                    (filters.value.length
                        ? allowedTypes.includes(
                            item.attributes?.dataType?.toLowerCase()
                        )
                        : true)
            ) || []
        )
    })

    const clearAllFilters = () => {
        filters.value = []
    }

    watch(entityParentQualifiedName, (newParent, oldParent) => {
        if (newParent !== oldParent) mutate()
    })


    const listCount: ComputedRef<any> = computed(() => filteredList.value?.length);
    const limit: ComputedRef<any> = computed(() => options.value?.limit);
    const offset: ComputedRef<any> = computed(() => options.value.offset);
    const totalCount: ComputedRef<any> = computed(() => data?.value?.approximateCount);

    const isLoadMore = computed(() => {
        if (listCount.value < totalCount.value) {
            return true;
        }
        return false;
    });

    const loadMore = () => {
        if (isLoadMore.value) {
            options.value.offset += options.value.limit;
        }
        mutate();
    };


    return {
        columnList: data,
        error,
        isLoading,
        mutate,
        searchTerm,
        filteredList,
        filters,
        clearAllFilters,
        limit,
        offset,
        isLoadMore,
        loadMore
    }
}
