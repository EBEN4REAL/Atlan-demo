import { computed, ref, ComputedRef, watch, Ref } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { userInterface } from '~/types/users/user.interface'
import { Users } from '~/services/service/users'
import useUserData from '~/composables/user/useUserData'
import useGroupMembers from '~/composables/group/useGroupMembers'
import group from '@common/pills/group.vue'

export default function useFacetUsers(
    config: {
        sort?: string
        columns?: string[]
        immediate?: boolean
        groupId?: Ref<string>
    } = { immediate: true }
) {
    const params = ref(new URLSearchParams())

    const queryText = ref('')
    const isEnriching = ref(false)

    const limit = ref(20)
    const offset = ref(0)
    params.value.append('limit', `${limit.value}`)
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
        offset.value += limit.value
        params.value.set('offset', `${offset.value}`)
        mutate()
    }

    const list: any = ref([])

    /**
     * Enrich the fetched records by adding another property: `isPartOfGroup`.
     * If a group ID is provided, this will be an indicator of whether the
     * user is part of the group or not.
     */
    const enrichRecords = () => {
        if (config.groupId?.value !== '') {
            isEnriching.value = true
            // Accumulate the IDs of all users for the filter.
            const userIds = list.value.map((user) => ({ id: user.id }))

            // Fetch the groups with the user IDs as the filter.
            const memberListParams = computed(() => ({
                groupId: config.groupId?.value,
                params: {
                    filter: {
                        $or: userIds,
                    },
                },
            }))

            const { memberList } = useGroupMembers(memberListParams)

            // When the group list is ready, enrich the records.
            watch(memberList, () => {
                list.value = list.value.map((user) => ({
                    ...user,
                    isPartOfGroup:
                        memberList.value.findIndex(
                            (member) => member.id === user.id
                        ) !== -1,
                }))
                isEnriching.value = false
            })
        }
    }

    watch(data, () => {
        if (data?.value?.records) {
            if (offset.value > 0) list.value.push(...data.value.records)
            else list.value = [...data.value.records]
        } else list.value = []
        enrichRecords()
    })

    // final user list including myself
    const userList = computed(() => {
        if (queryText.value !== '') {
            return [...list.value]
        }
        const tempList = list.value.filter((obj) => obj.username !== username)
        const myIndex = list.value.findIndex((obj) => obj.username === username)
        return [
            {
                firstName,
                id,
                username,
                lastName: `${lastName} (me)`,
            },
            ...tempList,
        ]
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
            // reseting the list if user has does a server search else this messes up the list index
            const filters = JSON.parse(params.value?.get('filter'))?.$and
            // as email verified filter is always applied, need to check if more than 1 is applied istead
            if (filters?.length > 1) {
                params.value.set('filter', '{"$and":[{"emailVerified":true}]}')
                mutate()
            }
        }
    }

    const handleSearch = (val: Event | string) => {
        queryText.value = val as string
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
        queryText,
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
        isEnriching,
        limit,
        offset,
    }
}
