import { ref } from 'vue'
import {
    GET_TYPEDEFS,
    CREATE_TYPEDEFS,
} from './key'

import { useAPI } from '~/services/api/useAPI'

// const saveAssetBMUpdateChanges = (guid: any, payload: any) =>
//     useAPI(UPDATE_ASSET_BUSINESS_METADATA, 'POST', {
//         params: { isOverwrite: true },
//         pathVariables: { guid },
//         cache: undefined,
//         body: payload,
//     })

const getBMList = () => {
    const options = ref({
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        dedupingInterval: 1,
        immediate: false,
    })
    return useAPI(GET_TYPEDEFS, 'GET', {
        params: { type: 'BUSINESS_METADATA' },
        cache: 'true',
        options,
    })
}

const addNewBusinessMetadata = (payload: object) => {
    const { data, mutate, error, isReady } = useAPI(
        CREATE_TYPEDEFS,
        'POST',
        {
            params: { type: 'BUSINESS_METADATA' },
            cache: undefined,
            body: payload,
        }
    )
    return { data, mutate, error, isReady }
}

const updateNewBusinessMetadata = (payload: object) => {
    const { data, mutate, error, isReady } = useAPI(
        CREATE_TYPEDEFS,
        'PUT',
        {
            params: { type: 'BUSINESS_METADATA' },
            cache: undefined,
            body: payload,
        }
    )
    return { data, mutate, error, isReady }
}

export const BusinessMetadataService = {
    // saveAssetBMUpdateChanges,
    getBMList,
    addNewBusinessMetadata,
    updateNewBusinessMetadata,
}
