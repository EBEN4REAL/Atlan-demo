import { useAsyncState } from '@vueuse/core'
import { Ref, watch } from 'vue'
import { fetcher } from '~/api'
import { GET_ASSET_RELATIONSHIP } from '~/api/keyMaps/asset'
import keyMaps from '~/api/keyMaps'

function constructRequest(guid: string) {
    const finalParams = new URLSearchParams()
    const attributes = [
        'name',
        'description',
        'userDescription',
        'customDescription',
        'dataType',
        'isPrimary',
        'order',
        'metadata',
        'relativePinOrder',
        'primary key',
        'foreign key',
        'tenantId',
    ]

    const paramsObj: any = {
        limit: 1000,
        offset: 0,
        relation: 'columns',
        includeClassificationAttributes: true,
        guid,
        excludeDeletedEntities: true,
    }

    attributes.forEach((val: string) => {
        finalParams.append('attributes', val)
    })
    Object.keys(paramsObj).forEach((key) => {
        finalParams.append(key, paramsObj[key])
    })

    return finalParams
}

export default function useColumns(id: Ref<string>) {
    const { execute, state, isReady, error } = useAsyncState(
        () => {
            const params = constructRequest(id?.value || id)
            return fetcher(keyMaps[GET_ASSET_RELATIONSHIP](), params, {})
        },
        { entities: [] },
        { resetOnExecute: true }
    )

    watch(id, (newId, oldId) => {
        if (newId !== oldId) execute()
    })

    return {
        columnList: state,
        isReady,
        error,
    }
}
