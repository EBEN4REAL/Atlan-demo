import { ref } from 'vue'
import { BasicSearchAttributes, ColumnAttributes } from '~/constant/projection'
import { SearchBasic } from '~/api/atlas/searchbasic'
import { useBusinessMetadataStore } from '~/store/businessMetadata'

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

    const { data, error, mutate, isValidating } = SearchBasic.BasicV2(
        '',
        ref(options)
    )
    return {
        data,
        error,
        loading: isValidating,
        mutate,
    }
}
