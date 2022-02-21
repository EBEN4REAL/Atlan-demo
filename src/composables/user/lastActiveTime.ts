import { useTimeAgo } from '@vueuse/core'
import { formatDateTime, getShortNotationDateTimeAgo } from '~/utils/date'

export const getLastActiveTime = (lastLoginTime) => {
    if (lastLoginTime) {
        return formatDateTime(lastLoginTime || '')
    }
    return ''
}
export const getLastActiveTimeAgo = (
    lastLoginTime,
    getResultInShortNotation = false
) => {
    if (lastLoginTime) {
        const timeAgoString =
            useTimeAgo(lastLoginTime, {
                max: 'year',
                fullDateFormatter: () => 'long time ago',
            }).value || ''
        return getResultInShortNotation
            ? getShortNotationDateTimeAgo(timeAgoString)
            : timeAgoString
    }
    return ''
}
