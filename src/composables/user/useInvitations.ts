import { computed } from 'vue'

import swrvState from '~/composables/utils/swrvState'
import { useAPI } from '~/services/api/useAPI'
import { pluralizeString } from '~/utils/string.ts'
import { roleMap } from '~/constant/role'

const getUserName = (user: any) => {
    const { firstName } = user
    const { lastName } = user
    if (firstName) {
        return `${firstName} ${lastName || ''}`
    }
    return user.email
}
const getUserRole = (user: any) => {
    const { roles } = user
    if (roles && roles.length > 0) {
        if (roles.length > 0) {
            const atlanRole = roles.find((role: string) => role.startsWith('$'))
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
            color: 'red',
            icon: 'close-circle',
            status: 'Disabled',
        }
    }
    if (user.isLocked) {
        return {
            color: 'red',
            icon: 'lock',
            status: 'Locked',
        }
    }
    return {
        color: 'green',
        icon: 'check-circle',
        status: 'Active',
    }
}
const getFormattedUser = (user: any) => {
    const localUser = {
        ...user,
        name: getUserName(user),
        group_count_string: pluralizeString('group', user.group_count || 0),
        status_object: getUserStatus(user),
        role_object: getUserRole(user),
    }
    return localUser
}
export default function useUsers(userListAPIParams: {
    limit: number
    offset: number
    filter: any
    sort: string
}) {
    const {
        data,
        error,
        isValidating,
        mutate: getUserList,
    } = useAPI('LIST_USERS', 'GET', {
        params: userListAPIParams,
        options: {
            revalidateOnFocus: false,
            dedupingInterval: 1,
        },
    })
    //   const {
    //     data,
    //     error,
    //     mutate: getUserList,
    //     isValidating,
    //   } = useSWRV(
    //     [getAPIPath("auth", "/users"), userListAPIParams, {}],
    //     fetcher,
    //     {
    //       revalidateOnFocus: false,
    //       dedupingInterval: 1,
    //     }
    //   );
    const { state, STATES } = swrvState(data, error, isValidating)

    const userList = computed(() => {
        if (data.value && data?.value?.records)
            return data?.value.records.map((user: any) =>
                getFormattedUser(user)
            )
        return []
    })
    const totalUserCount = computed(() => data?.value?.totalRecord ?? 0)
    const filteredUserCount = computed(() => data?.value?.filterRecord ?? 0)

    return {
        userList,
        totalUserCount,
        filteredUserCount,
        getUserList,
        state,
        STATES,
    }
}
