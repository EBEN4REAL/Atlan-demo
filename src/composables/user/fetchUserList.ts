import useSWRV from 'swrv'
import { computed, ref } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import swrvState from '../utils/swrvState'
import { Components } from '~/api/auth/client'

import { User, URL } from '~/api/auth/user'

export default function fetchUserList(dependent: any) {
    const params = ref({})
    // this is needed as there are multiple keys with the same param name
    const urlparam = new URLSearchParams()
    urlparam.append('limit', '20')
    urlparam.append('sort', 'first_name')
    urlparam.append('columns', 'first_name')
    urlparam.append('columns', 'last_name')
    urlparam.append('columns', 'username')
    params.value = urlparam

    const { data, error, mutate, isValidating } = useSWRV(
        [URL.UserList, params?.value, {}],
        () => {
            if (dependent.value) {
                return User.ListV2(params?.value)
            }

            return {}
        },
        {
            revalidateOnFocus: false,
            cache: new LocalStorageCache(),
            dedupingInterval: 1,
        }
    )
    const { state, STATES } = swrvState(data, error, isValidating)

    const list = computed(() => data.value?.records)
    const total = computed(() => data.value?.total_record)
    const filtered = computed(() => data.value?.filter_record)

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
                    $or: [
                        { first_name: { $ilike: `%${value}%` } },
                        { last_name: { $ilike: `%${value}%` } },
                        { username: { $ilike: `%${value}%` } },
                    ],
                })
            )
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
    }
}
