import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { useDebounceFn } from '@vueuse/core'
import { ref, Ref, computed } from 'vue'
import { LIST_API_KEYS } from '~/services/service/apikeys/key'
import { APIKey } from '~/services/service/apikeys'
import { formatDateTime } from '~/utils/date'
import { capitalizeFirstLetter } from '~/utils/string'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

export interface APIKeyParams {
    offset: number
    limit: number
    sort?: string
    filter?: unknown
}
const getAPIKeyValidity = (apikey) => {
    if (
        apikey?.attributes?.createdAt &&
        apikey?.attributes?.['access.token.lifespan']
    ) {
        // createdAt is unix timestamp in ms
        const validityUnixEpoch =
            parseInt(apikey?.attributes?.createdAt) / 1000 +
            parseInt(apikey.attributes['access.token.lifespan'])
        // getting dayjs obj from the calculated unix epoch to pass in datepicker
        return dayjs.unix(validityUnixEpoch)
    }
    return undefined
}
const getAPIKeyValidityStringRelative = (apikey) => {
    if (getAPIKeyValidity(apikey)) {
        return capitalizeFirstLetter(getAPIKeyValidity(apikey).fromNow())
    }
    return ''
}
const getAPIKeyValidityString = (apikey) => {
    if (getAPIKeyValidity(apikey)) {
        return formatDateTime(getAPIKeyValidity(apikey).format())
    }
    return ''
}
export default function useAPIKeysList(
    payload: Ref<APIKeyParams | null> = ref(null)
) {
    const params: Ref<APIKeyParams> = ref({
        offset: 0,
        limit: 100,
        sort: '-createdAt',
        filter: {},
    })
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
    const options = payload && payload.value ? payload.value : params.value

    const {
        data,
        isLoading,
        mutate: reFetchList,
    } = APIKey.List(options, {
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
                        formatDateTime(
                            apikey?.attributes?.createdAt || '',
                            {
                                dateStyle: 'medium',
                            },
                            'en-US',
                            true
                        ) || '',
                    validity: getAPIKeyValidity(apikey),
                    validityStringRelative:
                        getAPIKeyValidityStringRelative(apikey),
                    validityString: getAPIKeyValidityString(apikey),
                },
            })) ?? []
    )
    const filteredAPIKeysCount = computed(() => data?.value?.filterRecord)
    const totalAPIKeysCount = computed(
        () => data?.value?.totalRecord
        // return 0
    )
    const searchAPIKeys = useDebounceFn((searchText: string) => {
        params.value.filter = searchText.length
            ? { displayName: { $ilike: `${searchText}%` } }
            : {}
        reFetchList()
    }, 200)
    const paginateAPIKeys = (page: number) => {
        // modify offset
        const offset = (page - 1) * params.value.limit
        params.value.offset = offset
        reFetchList()
    }
    return {
        params,
        apiKeysList,
        isLoading,
        selectedAPIKey,
        reFetchList,
        searchAPIKeys,
        resetSelectedAPIKey,
        setSelectedAPIKey,
        paginateAPIKeys,
        filteredAPIKeysCount,
        totalAPIKeysCount,
    }
}
