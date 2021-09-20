import { Ref, ref, computed, watch } from 'vue'
import { BasicSearchAttributes, ColumnAttributes } from '~/constant/projection'
import { SearchBasic } from '~/api/atlas/searchbasic'
import { useBusinessMetadataStore } from '~/store/businessMetadata'
import { dataTypeList } from '~/constant/datatype'

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

    const options = {
        typeName: 'Column',
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        attributes: [
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


    const searchTerm = ref('')
    const filters: Ref<string[]> = ref([])

    const { data, error, mutate, isValidating, isLoading } = SearchBasic.BasicV2(
        '',
        ref(options)
    )

    const filteredList = computed(() => {
        const allowedTypes = dataTypeList
            .filter((typeList) => filters.value.includes(typeList.id))
            .reduce((acc: string[], dt) => [...acc, ...dt.type], [])
            .map((type) => type.toLowerCase())

        const keyword = searchTerm.value.toLowerCase()

        return (
            data.value?.entities?.filter(
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

    const clearAllFilters = () => {
        filters.value = []
    }

    watch(entityParentQualifiedName, (newParent, oldParent) => {
        if (newParent !== oldParent) mutate()
    })



    return {
        columnList: data,
        error,
        isLoading,
        mutate,
        searchTerm,
        filteredList,
        filters,
        clearAllFilters,
    }
}
