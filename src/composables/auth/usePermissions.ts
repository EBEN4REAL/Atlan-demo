import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { watch } from 'vue'
import { Access } from '~/services/service/access'

import { useAuthStore } from '~/store/auth'

export default function usePermissions() {
    const { data } = Access.WhoAmI({
        cacheKey: 'DEFAULT_PERMISSIONS',
        cacheOptions: {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            cache: new LocalStorageCache(),
            dedupingInterval: 1,
        },
    })
    const authStore = useAuthStore()
    watch(data, () => {
        authStore.setPermissions(data.value?.permissions)
        authStore.setRoles(data.value?.roles)
    })
    return {
        data,
    }
}
