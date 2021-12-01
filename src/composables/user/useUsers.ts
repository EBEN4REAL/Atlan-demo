import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import swrvState from '~/utils/swrvState'

import { pluralizeString } from '~/utils/string'
import { roleMap } from '~/constant/role'

import { Users } from '~/services/service/users'
import { LIST_USERS } from '~/services/service/users/key'

export const getUserName = (user: any) => {
    const { first_name } = user
    const { last_name } = user
    if (first_name) {
        return `${first_name} ${last_name || ''}`
    }
    return user.email
}
const getUserRole = (user: any) => {
    const { roles } = user
    if (roles && roles.length > 0) {
        if (roles.length > 0) {
            const atlanRoles = roles.filter((role: string) =>
                role.startsWith('$')
            )
            let atlanRole = ''
            // owner
            if (atlanRoles.indexOf('$owner') >= 0) atlanRole = '$owner'
            // member
            else if (atlanRoles.indexOf('$member') >= 0) atlanRole = '$member'
            // guest
            else if (atlanRoles.indexOf('$guest') >= 0) atlanRole = '$guest'
            return {
                name: roleMap[atlanRole] ? roleMap[atlanRole] : '',
                code: roleMap[atlanRole] ? atlanRole : '',
            }
        }
    }
    return {
        name: '',
        code: '',
    }
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
    if (!user.email_verified) {
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
        group_count_string: pluralizeString('group', user.group_count || 0),
        status_object: getUserStatus(user),
        role_object: getUserRole(user),
        created_at_time_ago: user.created_timestamp
            ? useTimeAgo(user.created_timestamp).value
            : '',
    }
    return localUser
}

const defaultCacheOption = {
    cacheOptions: {
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        cache: new LocalStorageCache(),
        dedupingInterval: 1,
    },
}
export const useUsers = (
    userListAPIParams,
    cacheKey?: string,
    cacheOption = defaultCacheOption
) => {
    const {
        data,
        mutate: getUserList,
        isLoading,
        isValidating,
        error,
    } = Users.List(userListAPIParams, {
        ...cacheOption,
        cacheKey: cacheKey ?? LIST_USERS,
    })

    const localUsersList: Ref<any[]> = ref([])

    watch(data, () => {
        const escapedData = data?.value?.records
            ? data?.value?.records?.map((user: any) => getFormattedUser(user))
            : [] // to prevent maping undefined

        if (data && data.value) {
            if (userListAPIParams.offset > 0) {
                localUsersList.value = [...localUsersList.value, ...escapedData]
            } else {
                localUsersList.value = escapedData
            }
        }
    })

    const usersListConcatenated: ComputedRef<any> = computed(
        () => localUsersList.value || []
    )
    const { state, STATES } = swrvState(data, error, isValidating)
    const userList = computed(() => {
        if (data.value && data?.value?.records)
            return data?.value.records.map((user: any) =>
                getFormattedUser(user)
            )
        return []
    })

    const totalUserCount = computed(() => data?.value?.total_record ?? 0)
    const filteredUserCount = computed(() => data?.value?.filter_record ?? 0)

    return {
        state,
        STATES,
        usersListConcatenated,
        userList,
        totalUserCount,
        filteredUserCount,
        getUserList,
        isLoading,
        isValidating,
        error
    }
}
interface params {
    limit: number
    offset: number
    filter: any
    sort: string
}