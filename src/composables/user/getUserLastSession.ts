import { computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import { Users } from '~/services/service/users/index'
import { formatDateTime, getShortNotationDateTimeAgo } from '~/utils/date'

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
    const lastActiveTime = computed(() => {
        if (latestSession?.value?.lastAccess) {
            return formatDateTime(latestSession?.value?.lastAccess || '')
        }
        return ''
    })
    const lastActiveTimeAgo = computed(() => {
        if (latestSession?.value?.lastAccess) {
            const timeAgoString =
                useTimeAgo(latestSession?.value?.lastAccess, {
                    max: 'week',
                    fullDateFormatter: () => 'long time ago',
                }).value || ''
            return getShortNotationDateTimeAgo(timeAgoString)
        }
        return ''
    })
    return {
        latestSession,
        error,
        isLoading,
        fetchUserSessions,
        lastActiveTime,
        lastActiveTimeAgo,
    }
}
