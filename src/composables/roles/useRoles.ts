import { watch, computed } from 'vue'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Roles } from '~/services/service/roles'
import swrvState from '~/utils/swrvState'

const getFormattedRole = (role: any) => {
    const localRole = {
        id: role.id,
        name: role.name.substring(1), // remove $ from name
        memberCount: parseInt(role.memberCount, 10)
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
        const customSort = ['member', 'admin', 'guest']

        const customSortFn = (a, b) =>
            customSort.indexOf(a.name) < customSort.indexOf(b.name) ? -1 : 1


        if (data?.value?.records?.length) {
            const roles = data.value.records.map((role: any) => getFormattedRole(role)).sort(customSortFn)
            return roles
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
