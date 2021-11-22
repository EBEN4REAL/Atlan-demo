import { capitalizeFirstLetter } from '~/utils/string'

export function useUtils() {
    function getAssetIcon(connectionQualifiedName) {
        const intercepts = connectionQualifiedName?.split('/')
        if (intercepts.length == 3) {
            return capitalizeFirstLetter(intercepts[1])
        } else if (intercepts.length == 4) {
            return 'Database'
        } else if (intercepts.length == 5) {
            return 'Schema'
        } else if (intercepts.length == 6) {
            return 'Table'
        } else if (intercepts.length == 7) {
            return 'Column'
        }
        return ''
    }
    return {
        getAssetIcon,
    }
}
