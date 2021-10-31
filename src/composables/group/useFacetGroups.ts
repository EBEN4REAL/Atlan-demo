import { computed, ref, ComputedRef } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Groups } from '~/services/service/groups'

export default function useFacetGroups() {
    const params = ref(new URLSearchParams())
    params.value.append('limit', '20')
    params.value.append('sort', 'name')
    // params.value.append('columns', 'first_name')
    // params.value.append('columns', 'last_name')
    // params.value.append('columns', 'username')
    // params.value.append('columns', 'id')
    // params.value.append('filter', '{"$and":[{"email_verified":true}]}')

    const { data, mutate } = Groups.List(params, {
        cacheOptions: {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            cache: new LocalStorageCache(),
            dedupingInterval: 1,
        },
        cacheKey: 'DEFAULT_GROUPS',
    })

    const list: ComputedRef<userInterface[]> = computed(
        () => data.value?.records ?? []
    )

    // const total: ComputedRef<number> = computed(() => data.value?.total_record)
    const total: ComputedRef<userInterface[]> = computed(
        () => data.value?.filter_record
    )

    function setLimit(limit = 20) {
        params.value.set('limit', `${limit}`)
    }

    let debounce: any = null
    const handleSearch = (val: Event | string) => {
        let value = ''
        if (typeof val !== 'string') {
            value = (<HTMLInputElement>val.target).value as string
        } else {
            value = val
        }
        clearTimeout(debounce)
        debounce = setTimeout(() => {
            params.value.set(
                'filter',
                JSON.stringify({
                    $and: [
                        {
                            $or: [
                                { name: { $ilike: `%${value}%` } },
                                { alias: { $ilike: `%${value}%` } },
                            ],
                        },
                    ],
                })
            )
            mutate()
        }, 200)
    }

    return {
        list,
        total,
        data,
        mutate,
        params,
        handleSearch,
        setLimit,
    }
}
