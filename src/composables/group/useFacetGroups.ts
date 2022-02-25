import { computed, ref, ComputedRef, watch, Ref } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Groups } from '~/services/service/groups'
import { groupInterface } from '~/types/groups/group.interface'
import getUserGroups from '~/composables/user/getUserGroups'

export default function useFacetGroups(
    sort?: string,
    columns?: string[],
    immediate = true,
    userId?: Ref<string>
) {
    const params = ref(new URLSearchParams())
    params.value.set('sort', sort ?? 'name')
    const isEnriching = ref(false)
    const limit = ref(20)
    const offset = ref(0)
    params.value.append('limit', `${limit.value}`)

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
        offset.value += limit.value
        params.value.set('offset', `${offset.value}`)
        mutate()
    }

    const list = ref<groupInterface[]>([])
    /**
     * Enrich the fetched records by adding another property: `hasUserAsMember`.
     * If a user ID is provided, this will be an indicator of whether the
     * group has this user or not.
     */
    const enrichRecords = () => {
        if (userId?.value !== '') {
            isEnriching.value = true
            // Accumulate the IDs of all users for the filter.
            const groupIds = list.value.map((user) => ({ id: user.id }))

            // Fetch the groups with the user IDs as the filter.
            const groupListParams = computed(() => ({
                userId: userId?.value,
                params: {
                    filter: {
                        $or: groupIds,
                    },
                },
            }))

            const { groupList: userGroupsList } = getUserGroups(groupListParams)

            // When the userGroup list is ready, enrich the records (groups).
            watch(userGroupsList, () => {
                list.value = list.value.map((group) => ({
                    ...group,
                    hasUserAsMember:
                        userGroupsList.value.findIndex(
                            (userGroup) => userGroup.id === group.id
                        ) !== -1,
                }))
                isEnriching.value = false
            })
        }
    }

    watch(data, () => {
        if (data.value?.records) {
            if (offset.value > 0) list.value.push(...data.value.records)
            else list.value = [...data.value.records]
        } else list.value = []
        enrichRecords()
    })

    // const total: ComputedRef<number> = computed(() => data.value?.totalRecord)
    const filterTotal = computed(() => data.value?.filterRecord)

    const total = computed(() => data.value?.totalRecord)

    function setLimit(l = 20) {
        limit.value = l
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
        offset.value = 0
        params.value.set('offset', `${offset.value}`)
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

    // const handleClick = () => {
    //     if (!finalList.length ||) resetFilter()
    // }

    return {
        // handleClick,
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
        isEnriching,
        limit,
        offset,
    }
}
