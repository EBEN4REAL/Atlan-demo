import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { useDebounceFn } from '@vueuse/core'
import { ref, Ref, computed } from 'vue'
import { LIST_API_KEYS } from '~/services/service/apikeys/key'
import { APIKey } from '~/services/service/apikeys'
import { formatDateTime } from '~/utils/date'

interface APIKeyParams {
    offset: number
    limit: number
    sort: string
    filter: unknown
}
export default function useAPIKeysList() {
    const selectedAPIKey = ref({
        displayName: '',
        description: '',
        personas: [],
    })
    const setSelectedAPIKey = (apiKey) => {
        selectedAPIKey.value = { ...apiKey }
    }
    const resetSelectedAPIKey = () => {
        selectedAPIKey.value = {
            displayName: '',
            description: '',
            personas: [],
        }
    }
    const params: Ref<APIKeyParams> = ref({
        offset: 0,
        limit: 100,
        sort: '-created_at',
        filter: {},
    })
    const {
        data,
        isLoading,
        mutate: reFetchList,
    } = APIKey.List(params.value, {
        cacheOptions: {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            cache: new LocalStorageCache(),
            dedupingInterval: 1,
        },
        cacheKey: LIST_API_KEYS,
    })
    const apiKeysList = computed(
        () =>
            data?.value?.records?.map((apikey) => ({
                ...apikey,
                attributes: {
                    ...apikey.attributes,
                    createdAtFormatted:
                        formatDateTime(apikey?.attributes?.createdAt || '', {
                            dateStyle: 'medium',
                        }) || '',
                },
            })) ?? []
    )
    const searchAPIKeys = useDebounceFn((searchText: string) => {
        params.value.filter = searchText.length
            ? { display_name: { $ilike: `${searchText}%` } }
            : {}
        reFetchList()
    }, 200)

    return {
        apiKeysList,
        isLoading,
        selectedAPIKey,
        reFetchList,
        searchAPIKeys,
        resetSelectedAPIKey,
        setSelectedAPIKey,
    }
}
