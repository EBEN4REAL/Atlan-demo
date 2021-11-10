import { APIKey } from '~/services/service/apikeys'

export default function useUpdateAPIKey(apiKeyDirty) {
    const { mutate: updateAPIKey, isLoading } = APIKey.Update(apiKeyDirty, {
        asyncOptions: {
            immediate: false,
            onError: (e) => {
                throw e
            },
        },
    })
    return { updateAPIKey, isLoading }
}
