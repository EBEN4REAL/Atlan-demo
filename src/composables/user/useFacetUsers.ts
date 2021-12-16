import { computed, ref, ComputedRef, watch } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { userInterface } from '~/types/users/user.interface'
import { Users } from '~/services/service/users'

export default function useFacetUsers(sort?: string, columns?: string[], immediate = true) {
    const params = ref(new URLSearchParams())

    const limit = 20
    let offset = 0
    params.value.append('limit', `${limit}`)
    if (columns?.length) {
        params.value.append('sort', sort ?? columns[0])
        columns.forEach(c => {
            params.value.append('columns', c)
        })
    }
    else {
        params.value.append('sort', sort ?? 'firstName')
        params.value.append('columns', 'firstName')
        params.value.append('columns', 'lastName')
        params.value.append('columns', 'username')
        params.value.append('columns', 'id')
    }

    params.value.append('filter', '{"$and":[{"emailVerified":true}]}')

    const { data, mutate, isLoading, error, isReady } = Users.List(params, {
        asyncOptions: {
            immediate,
            resetOnExecute: false,
        },
    })

    const loadMore = () => {
        offset += limit
        params.value.set('offset', `${offset}`)
        mutate()
    }

    const list: any = ref([])
    watch(data, () => {
        if (data?.value?.records) {
            if (offset > 0)
                list.value.push(...data.value.records)
            else list.value = [...data.value.records]
        } else
            list.value = []
    })

    // const total: ComputedRef<number> = computed(() => data.value?.total_record)
    const filterTotal = computed(() => data.value?.filter_record)

    const total = computed(() => data.value?.total_record)

    function setLimit(l = 20) {
        params.value.set('limit', `${l}`)
    }

    let debounce: any = null
    const handleSearch = (val: Event | string) => {
        offset = 0
        params.value.set('offset', `${offset}`)
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
                        { emailVerified: true },
                        {
                            $or: [
                                { firstName: { $ilike: `%${value}%` } },
                                { lastName: { $ilike: `%${value}%` } },
                                { username: { $ilike: `%${value}%` } },
                            ],
                        },
                    ],
                })
            )
            mutate()
        }, 200)
    }

    return {
        loadMore,
        isLoading,
        error,
        list,
        total,
        data,
        mutate,
        params,
        isReady,
        handleSearch,
        setLimit,
        filterTotal,
    }
}
