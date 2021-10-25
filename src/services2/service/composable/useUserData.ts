import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services2/service/tenant'

import { watch, computed } from 'vue'
import { useAuthStore } from '~/store/auth'

export default function useUserData() {
    const authStore = useAuthStore()

    const avatarURL = computed(
        () =>
            `${window.location.origin}/api/service/avatar/${authStore.username}`
    )

    return {
        name: authStore.name,
        username: authStore.username,
        avatar: avatarURL.value,
    }
}
