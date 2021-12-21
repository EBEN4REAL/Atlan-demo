import { computed, ref, ComputedRef, watch, Ref } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Groups } from '~/services/service/groups'
import { groupInterface } from '~/types/groups/group.interface'

export default function useFacetGroups(
    sort?: string,
    columns?: string[],
    immediate = true
) {
    const params = ref(new URLSearchParams())
    params.value.set('sort', sort ?? 'name')
    const limit = 20
    let offset = 0
    params.value.append('limit', `${limit}`)

    if (columns?.length) {
        params.value.set('sort', sort ?? columns[0])
        columns.forEach((c) => {
            params.value.append('columns', c)
        })
    }

    const { data, mutate, isLoading, isReady, error } = Groups.List(params, {
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

    const list = ref<groupInterface[]>([])
    watch(data, () => {
        if (data.value?.records) {
            if (offset > 0) list.value.push(...data.value.records)
            else list.value = [...data.value.records]
        } else
            list.value = []

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
        resetFilter,
        total,
        data,
        mutate,
        params,
        isReady,
        loadMore,
        error,
        handleSearch,
        setLimit,
        filterTotal,
        isLoading,
    }
}
