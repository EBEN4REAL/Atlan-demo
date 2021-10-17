import whoami from '~/composables/user/whoami'

export function useAccess() {
    const { username, role } = whoami()
    function canUserDeleteFolder(ownerUsername: string) {
        return username.value === ownerUsername
    }
    function canUserUpdateQuery(ownerUsername: string | undefined) {
        if (username.value === ownerUsername) return true
        return false
    }
    return {
        canUserUpdateQuery,
        canUserDeleteFolder,
    }
}
