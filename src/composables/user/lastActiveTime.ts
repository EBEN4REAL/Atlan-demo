import { useTimeAgo } from '@vueuse/core'
import { formatDateTime, getShortNotationDateTimeAgo } from '~/utils/date'

export const getLastActiveTime = (lastLoginTime) => {
    if (lastLoginTime) {
        return formatDateTime(lastLoginTime || '')
    }
    return ''
}
export const getLastActiveTimeAgo = (lastLoginTime) => {
    if (lastLoginTime) {
        const timeAgoString =
            useTimeAgo(lastLoginTime, {
                max: 'week',
                fullDateFormatter: () => 'long time ago',
            }).value || ''
        return getShortNotationDateTimeAgo(timeAgoString)
    }
    return ''
}
