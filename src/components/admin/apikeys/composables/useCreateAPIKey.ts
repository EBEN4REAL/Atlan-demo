import { APIKey } from '~/services/service/apikeys'

export default function useCreateAPIKey(apiKeyDirty) {
    const {
        data,
        mutate: createAPIKey,
        isLoading,
    } = APIKey.Create(apiKeyDirty, {
        asyncOptions: {
            immediate: false,
            onError: (e) => {
                throw e
            },
        },
    })
    return { createAPIKey, isLoading, data }
}
