import { computed, ref, ComputedRef, watch } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { userInterface } from '~/types/users/user.interface'
import { Users } from '~/services/service/users'

export default function useFacetUsers(immediate = true) {
    const params = ref(new URLSearchParams())
    params.value.append('limit', '20')
    params.value.append('sort', 'firstName')
    params.value.append('columns', 'firstName')
    params.value.append('columns', 'lastName')
    params.value.append('columns', 'username')
    params.value.append('columns', 'id')
    params.value.append('filter', '{"$and":[{"emailVerified":true}]}')

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
