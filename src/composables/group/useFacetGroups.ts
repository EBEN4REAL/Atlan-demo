import { computed, ref, ComputedRef, watch } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Groups } from '~/services/service/groups'
import { groupInterface } from '~/types/groups/group.interface'

export default function useFacetGroups(
    sort: string,
    columns: string[],
    immediate = true
) {
    const params = ref(new URLSearchParams())
    params.value.set('sort', sort ?? 'name')
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
        isReady,
        error,
        handleSearch,
        setLimit,
        filterTotal,
        isLoading,
    }
}
