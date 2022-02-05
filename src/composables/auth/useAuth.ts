import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'

export default function useAuth() {
    const isAccess = ref(false)
    const authStore = useAuthStore()
    const currentRoute = useRoute()
    const getCurrentPermissions = currentRoute.meta.permissions

    watch(
        () => authStore.permissions,
        () => {
            if (getCurrentPermissions) {
                if (
                    getCurrentPermissions?.every(
                        (elem) => authStore.permissions.indexOf(elem) > -1
                    )
                ) {
                    isAccess.value = true
                }
            }
        },
        { immediate: true }
    )
    const checkAccess = (
        permissions: Array<string> | string,
        operator: 'and' | 'or' = 'and'
    ) => {
        if (Array.isArray(permissions)) {
            if (operator === 'or')
                return permissions?.some(
                    (elem) => authStore.permissions.indexOf(elem) > -1
                )
            return permissions?.every(
                (elem) => authStore.permissions.indexOf(elem) > -1
            )
        }
        return authStore.permissions.indexOf(permissions) > -1
    }

    return {
        isAccess,
        checkAccess,
    }
}
