import { computed } from 'vue'
import { Users } from '~/services/service/users/index'

export default function getUserLastSession(userId) {
    const sessionParams = { max: 1, first: 0 }
    const pathVariable = computed(() => ({ id: userId.value }))
    const {
        data,
        error,
        mutate: fetchUserSessions,
        isLoading,
    } = Users.GetUserSessions(pathVariable, sessionParams, {
        asyncOptions: { immediate: false },
    })
    const latestSession = computed(() => {
        if (data?.value?.length) {
            return data.value.reduce(
                (acc, val) => (acc.lastAccess > val.lastAccess ? acc : val),
                0
            )
        }
        return {}
    })
    return {
        latestSession,
        error,
        isLoading,
        fetchUserSessions,
    }
}
