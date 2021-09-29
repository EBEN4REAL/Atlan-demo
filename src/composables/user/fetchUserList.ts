import useSWRV from 'swrv'
import { computed, ref, ComputedRef } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { User, URL } from '@services/keycloak/users/users_api'
import swrvState from '../utils/swrvState'
import { userInterface } from '~/types/users/user.interface'

export default function fetchUserList(immediate: boolean = true) {
    const params = ref(new URLSearchParams())
    // this is needed as there are multiple keys with the same param name
    params.value.append('limit', '20')
    params.value.append('sort', 'first_name')
    params.value.append('columns', 'first_name')
    params.value.append('columns', 'last_name')
    params.value.append('columns', 'username')
    params.value.append('filter', '{"$and":[{"email_verified":true}]}')

    const { data, error, mutate, isValidating } = useSWRV(
        [URL.UserList, params?.value, {}],
        () => {
            if (immediate) return User.ListV2(params?.value)
            immediate = true

            return {}
        },
        {
            revalidateOnFocus: false,
            cache: new LocalStorageCache(),
            dedupingInterval: 1,
        }
    )
    const { state, STATES } = swrvState(data, error, isValidating)

    const list: ComputedRef<userInterface[]> = computed(
        () => data.value?.records ?? []
    )

    const total: ComputedRef<number> = computed(() => data.value?.total_record)
    const filtered: ComputedRef<userInterface[]> = computed(
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
            console.log(params.value, 'params')
            mutate()
        }, 200)
    }

    return {
        list,
        filtered,
        total,
        data,
        error,
        state,
        STATES,
        mutate,
        params,
        handleSearch,
        setLimit,
    }
}
