import { useAsyncState } from '@vueuse/core'
import { Ref, watch } from 'vue'
import { fetcher } from '~/api'
import { GET_ASSET_RELATIONSHIP } from '~/api/keyMaps/asset'
import keyMaps from '~/api/keyMaps'

import { BasicSearchAttributes, tableauAttributes, SavedQueryAttributes, ColumnAttributes } from '~/constant/projection'
import useBusinessMetadataStore from '~/store/businessMetadata'

// TODO : delete this composable and merge with ./useColumns.ts or make a generic composable to fetch all kinds or relationships
function constructRequest(guid: string, assetType: string) {
    const finalParams = new URLSearchParams()
    const attributes = [
        'name',
        'description',
        'userDescription',
        'customDescription',
        'dataType',
        'order',
        'metadata',
        ...BasicSearchAttributes,
        ...useBusinessMetadataStore().getBusinessMetadataListProjections,
        ...tableauAttributes,
        ...SavedQueryAttributes,
        ...ColumnAttributes
    ]

    const paramsObj: any = {
        limit: 1000,
        offset: 0,
        relation: assetType,
        includeClassificationAttributes: true,
        guid,
        excludeDeletedEntities: true,
        includeSubClassifications: true,
        includeSubTypes: true,
    }

    attributes.forEach((val: string) => {
        finalParams.append('attributes', val)
    })
    Object.keys(paramsObj).forEach((key) => {
        finalParams.append(key, paramsObj[key])
    })

    return finalParams
}

export default function useBiRelations(id: string, assetType: string) {
    const { execute, state, isReady, error } = useAsyncState(
        () => {
            const params = constructRequest(id?.value || id, assetType)

            return fetcher(keyMaps[GET_ASSET_RELATIONSHIP](), params, {})
        },
        { entities: [] },
        { resetOnExecute: true }
    )

    watch(id, (newId, oldId) => {
        if (newId !== oldId) execute()
    })

    return {
        list: state,
        isReady,
        error,
    }
}
