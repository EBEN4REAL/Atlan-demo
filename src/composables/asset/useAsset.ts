import { watch, ref } from 'vue'
import { BasicSearchAttributes, tableauAttributes } from '~/constant/projection'
import { SearchBasic } from '~/api/atlas/searchbasic'
import useBusinessMetadataStore from '~/store/businessMetadata'

export default function useAsset({
    entityId,
    isUpdateStatus = true,
    fetchRelationships = false,
    fetchAssetByAttibute = '__guid',
}) {
    const entityFilters = {
        condition: 'AND',
        criterion: [
            {
                attributeName: fetchAssetByAttibute || '__guid',
                attributeValue: entityId,
                operator: 'eq',
            },
        ],
    }

    const options = {
        typeName: 'AtlanAsset',
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
            'banner',
            'bannerMessage',
            'bannerUpdatedAt',
            'bannerUpdatedBy',
            ...BasicSearchAttributes,
            ...useBusinessMetadataStore().getBusinessMetadataListProjections,
            ...tableauAttributes,
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
