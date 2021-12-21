import { computed, ref, ComputedRef, watch, Ref } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { userInterface } from '~/types/users/user.interface'
import { Users } from '~/services/service/users'
import useUserData from '~/composables/user/useUserData'

export default function useFacetUsers(
    config: {
        sort?: string,
        columns?: string[],
        immediate?: boolean
    } = { immediate: true }
) {
    const params = ref(new URLSearchParams())

    const queryText = ref('')

    const limit = 20
    let offset = 0
    params.value.append('limit', `${limit}`)
    if (config.columns?.length) {
        params.value.append('sort', config.sort ?? config.columns[0])
        config.columns.forEach((c) => {
            params.value.append('columns', c)
        })
    } else {
        params.value.append('sort', config.sort ?? 'firstName')
        params.value.append('columns', 'firstName')
        params.value.append('columns', 'lastName')
        params.value.append('columns', 'username')
        params.value.append('columns', 'id')
    }

    params.value.append('filter', '{"$and":[{"emailVerified":true}]}')

    const { data, mutate, isLoading, error, isReady } = Users.List(params, {
        asyncOptions: {
            immediate: config.immediate,
            resetOnExecute: false,
        },
    })

    // myself
    const { username, firstName, lastName, id } = useUserData()


    const loadMore = () => {
        offset += limit
        params.value.set('offset', `${offset}`)
        mutate()
    }

    const list: any = ref([])
    watch(data, () => {
        if (data?.value?.records) {
            if (offset > 0) list.value.push(...data.value.records)
            else list.value = [...data.value.records]
        } else
            list.value = []
    })



    // final user list including myself
    const userList = computed(() => {
        if (queryText.value !== '') {
            return [...list.value]
        }
        const tempList = list.value.filter(
            (obj) => obj.username !== username
        )
        return [
            {
                username,
                id,
                firstName,
                lastName: `${lastName} (me)`,
            },
            ...tempList,
        ]
    })

    // const total: ComputedRef<number> = computed(() => data.value?.totalRecord)
    const filterTotal = computed(() => data.value?.filterRecord)

    const total = computed(() => data.value?.totalRecord)

    function setLimit(l = 20) {
        params.value.set('limit', `${l}`)
    }

    let debounce: any = null

    const resetFilter = () => {
        if (params.value.has('filter')) {
            params.value.delete('filter')
            mutate()
        }
    }

    const handleSearch = (val: Event | string) => {
        queryText.value = val as string
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
        userList,
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
        resetFilter,
    }
}
