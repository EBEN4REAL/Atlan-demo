import useSWRV from 'swrv'
import { computed, ref, watch } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Groups } from '~/services/service/groups'
import swrvState from '../utils/swrvState'

export default function fetchGroupList(immediate: boolean = true) {
    const params = ref(new URLSearchParams())
    // this is needed as there are multiple keys with the same param name
    params.value.append('limit', '20')
    params.value.append('sort', 'name')
    params.value.append('columns', 'name')
    params.value.append('columns', 'usercount')
    params.value.append('columns', 'id')
    params.value.append('columns', 'attributes')

    const { data, error, mutate, isValidating } = useSWRV(
        ['/groups', params?.value, {}],
        () => {
            if (immediate) return Groups.List(params?.value)
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

    const list = computed(() => data.value?.records ?? [])
    const total = computed(() => data.value?.totalRecord)
    const filtered = computed(() => data.value?.filterRecord)
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
    watch([list, data], () => {
        console.log('grps', list.value, data.value?.data.value?.records)
    })

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
