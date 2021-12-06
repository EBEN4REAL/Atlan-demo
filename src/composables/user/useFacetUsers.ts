import { computed, ref, ComputedRef, watch } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { userInterface } from '~/types/users/user.interface'
import { Users } from '~/services/service/users'

export default function useFacetUsers(immediate = true) {
    const params = ref(new URLSearchParams())
    params.value.append('limit', '20')
    params.value.append('sort', 'first_name')
    params.value.append('columns', 'first_name')
    params.value.append('columns', 'last_name')
    params.value.append('columns', 'username')
    params.value.append('columns', 'id')
    params.value.append('filter', '{"$and":[{"email_verified":true}]}')

    const { data, mutate, isLoading, error } = Users.List(params, {
        asyncOptions: {
            immediate,
            resetOnExecute: false,
        },
    })

    const list = ref([])
    watch(data, () => {
        if (data.value?.records) {
            list.value = [...data?.value?.records]
        } else {
            list.value = []
        }
    })

    // const total: ComputedRef<number> = computed(() => data.value?.total_record)
    const filterTotal = computed(() => data.value?.filter_record)

    const total = computed(() => data.value?.total_record)

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
                        { email_verified: true },
                        {
                            $or: [
                                { first_name: { $ilike: `%${value}%` } },
                                { last_name: { $ilike: `%${value}%` } },
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
        isLoading,
        error,

        list,
        total,
        data,
        mutate,
        params,
        handleSearch,
        setLimit,
        filterTotal,
    }
}
