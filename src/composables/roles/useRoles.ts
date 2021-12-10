import { watch, computed } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Roles } from '~/services/service/roles'
import swrvState from '~/utils/swrvState'

const getFormattedRole = (role: any) => {
    const localRole = {
        id: role.id,
        name: role.name.substring(1), // remove $ from name
        memberCount: parseInt(role.memberCount,10)
    }
    return localRole
}
export default function useRoles() {
    const {
        data,
        mutate: getRoleList,
        isLoading,
        isValidating,
        error,
    } = Roles.List(
        {
            filter: {
                level: 'workspace',
            },
        },
        {
            cacheOptions: {
                shouldRetryOnError: false,
                revalidateOnFocus: false,
                cache: new LocalStorageCache(),
                dedupingInterval: 1,
            },
            cacheKey: 'LIST_ROLES',
        }
    )

    const { state, STATES } = swrvState(data, error, isValidating)
    const roleList = computed(() => {
        if (data.value && data.value.records.length) {
            return data.value.records.map((role: any) => getFormattedRole(role))
        }
        return []
    })

    return {
        roleList,
        getRoleList,
        state,
        STATES,
    }
}
