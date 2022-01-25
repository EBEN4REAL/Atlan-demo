import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import axios from 'axios'
import swrvState from '~/utils/swrvState'

import { pluralizeString } from '~/utils/string'
import { roleMap } from '~/constant/role'

import { Users } from '~/services/service/users'
import { useOptions } from '~/services/api/common'
import { userStatusOptions } from '~/constant/users'

export const getUserName = (user: any) => {
    const { firstName } = user
    const { lastName } = user
    /** remove ` (me) string if present from last name`; we add it here @see {@link src/composables/user/useFacetUsers.ts} */
    const lastNameArray = lastName?.split(' ') || []
    if (firstName) {
        return `${firstName} ${
            lastNameArray.length ? lastNameArray[0] || '' : lastName
        }`
    }
    return user.username
}

const getWorkspaceRole = (user: any) => {
    const { roles, defaultRoles } = user

    const filterHelper = (a) =>
        a?.filter((role: string) => role.startsWith('$')) ?? []
    const atlanRoles = [
        ...new Set([...filterHelper(roles), ...filterHelper(defaultRoles)]),
    ]
    if (atlanRoles.includes('$admin')) {
        return 'Admin'
    }
    if (atlanRoles.includes('$member')) {
        return 'Member'
    }
    if (atlanRoles.includes('$guest')) {
        return 'Guest'
    }
    return ''
}

const getUserPersona = (user: any) => {
    const { personas } = user
    return personas
}

const getUserRole = (user: any) => {
    const { roles, defaultRoles } = user
    let atlanRoles: string[] = []
    const atlanRole = { name: '', code: '' }

    const filterHelper = (a) =>
        a?.filter((role: string) => role.startsWith('$')) ?? []

    const roleFilter = roles?.filter(
        (role: string) => role !== 'default-roles-default'
    )

    atlanRoles = [
        ...new Set([
            ...filterHelper(roleFilter),
            ...filterHelper(defaultRoles),
        ]),
    ]

    // eslint-disable-next-line no-restricted-syntax
    for (const code in roleMap)
        if (atlanRoles.indexOf(code) >= 0) {
            atlanRole.name = roleMap[code]
            atlanRole.code = code
            break
        }

    return atlanRole
}

const getUserStatus = (user: any) => {
    if (!user.enabled) {
        return {
            color: 'text-error',
            icon: 'fal times-circle',
            status: 'Disabled',
        }
    }
    if (user.isLocked) {
        return {
            color: 'text-error',
            icon: 'fa lock',
            status: 'Locked',
        }
    }
    if (!user.emailVerified) {
        return {
            color: 'text-error',
            icon: 'fa lock',
            status: 'Invited',
        }
    }
    return {
        color: 'text-success',
        icon: 'fas check-circle',
        status: 'Active',
    }
}
export const getFormattedUser = (user: any) => {
    const localUser = {
        ...user,
        name: getUserName(user),
        group_count_string: pluralizeString('group', user.groupCount || 0),
        persona_count_string: pluralizeString(
            'persona',
            user?.personas?.length || 0
        ),
        status_object: getUserStatus(user),
        role_object: getUserRole(user),
        workspaceRole: getWorkspaceRole(user),
        personaList: getUserPersona(user),
        created_at_time_ago: user.createdTimestamp
            ? useTimeAgo(user.createdTimestamp).value
            : '',
    }
    return localUser
}

const defaultCacheOption = {
    cacheOptions: {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        dedupingInterval: 0,
    },
}
export const useUsers = (userListAPIParams, immediate = true) => {
    const options: useOptions = {}
    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    options.asyncOptions = ref({
        resetOnExecute: false,
        immediate,
    })

    const { data, mutate, isLoading, isValidating, error, isReady } =
        Users.List(userListAPIParams, options)

    const localUsersList: Ref<any[]> = ref([])

    const userList: Ref<any[]> = ref([])
    const total = computed(() => data.value?.totalRecord)

    watch(data, () => {
        if (data?.value?.records) {
            const escapedData = data?.value?.records
                ? data?.value?.records?.map((user: any) =>
                      getFormattedUser(user)
                  )
                : [] // to prevent maping undefined
            userList.value = escapedData

            if (data && data.value) {
                if (userListAPIParams.offset > 0) {
                    localUsersList.value = [
                        ...localUsersList.value,
                        ...escapedData,
                    ]
                } else {
                    localUsersList.value = escapedData
                }
            }
        } else {
            userList.value = []
            localUsersList.value = []
        }
    })

    const usersListConcatenated: ComputedRef<any> = computed(
        () => localUsersList.value || []
    )
    const { state, STATES } = swrvState(data, error, isValidating)
    // const userList = computed(() => {
    //     if (data.value && data?.value?.records)
    //         return data?.value.records.map((user: any) =>
    //             getFormattedUser(user)
    //         )
    //     return []
    // })

    const totalUserCount = computed(() => data?.value?.totalRecord ?? 0)
    const filteredUserCount = computed(() => data?.value?.filterRecord ?? 0)

    const cancelRequest = () => {
        if (cancel) {
            cancel.cancel('operation cancelled')
        }
        cancel = axios.CancelToken.source()
        options.options.value = {
            cancelToken: cancel.token,
        }
    }

    const getUserList = () => {
        cancelRequest()
        mutate()
    }

    const getUserTypeAggregations = () => {
        const result = ref({
            active: 0,
            disabled: 0,
            invited: 0,
        })
        userStatusOptions.forEach((status) => {
            const payload = {
                limit: 1,
                offset: 0,
                sort: 'firstName',
                filter: { $and: [JSON.parse(status.value)] },
            }
            const { data } = Users.List(payload)
            watch(data, () => {
                result.value[status.id] = data?.value?.filterRecord
            })
        })
        return result
    }
    return {
        total,
        state,
        STATES,
        usersListConcatenated,
        userList,
        isReady,
        totalUserCount,
        filteredUserCount,
        getUserList,
        isLoading,
        isValidating,
        error,
        cancelRequest,
        mutate,
        getUserTypeAggregations,
    }
}
interface params {
    limit: number
    offset: number
    filter: any
    sort: string
}
