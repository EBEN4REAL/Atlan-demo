import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'

export default function useAuth() {
    const isAccess = ref(false)
    const authStore = useAuthStore()
    const currentRoute = useRoute()
    const getCurrentPermissions = currentRoute.meta.permissions
    if (getCurrentPermissions) {
        if (
            getCurrentPermissions?.every(
                (elem) => authStore.permissions.indexOf(elem) > -1
            )
        ) {
            isAccess.value = true
        }
    }

    return {
        isAccess,
    }
}
