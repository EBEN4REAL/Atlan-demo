import useSWRV from 'swrv'
import { computed, ref } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import swrvState from '../utils/swrvState'
import { Components } from '~/api/auth/client'

import { Group, URL } from '~/api/auth/group'

export default function fetchGroupList(immediate: boolean = true) {
    const params = ref({})
    // this is needed as there are multiple keys with the same param name
    const urlparam = new URLSearchParams()
    urlparam.append('limit', '20')
    urlparam.append('sort', 'name')
    urlparam.append('columns', 'name')
    urlparam.append('columns', 'user_count')

    params.value = urlparam

    const { data, error, mutate, isValidating } = useSWRV(
        [URL.GroupList, params?.value, {}],
        () => {
            if (immediate) return Group.ListV2(params?.value)
            else immediate = true

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
    function setLimit(limit = 20) {
        params.value.set('limit', `${limit}`)
    }

    let debounce: any = null
    const handleSearch = (val: any) => {
        let value = ''
        if (val?.target) {
            value = val.target.value
        } else {
            value = val
        }

        clearTimeout(debounce)
        debounce = setTimeout(() => {
            if (val) {
                params.value.set(
                    'filter',
                    JSON.stringify({
                        $or: [{ name: { $ilike: `%${value}%` } }],
                    })
                )
            } else {
                params.value.set('filter', null)
            }
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
        handleSearch,
        setLimit,
    }
}
