import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { watch } from 'vue'
import { Access } from '~/services/service/access'

import { useAuthStore } from '~/store/auth'

export default function usePermissions(immediate = true) {
    const { data, mutate } = Access.WhoAmI({
        asyncOptions: {
            immediate,
            onError: (e) => {
                throw e
            },
        }
    })
    const authStore = useAuthStore()
    watch(data, () => {
        authStore.setPermissions(data.value?.permissions)
        authStore.setRoles(data.value?.roles)
        authStore.setDecentralizedRoles(data.value?.decentralizedRoles)
        authStore.setPersonas(data.value?.personas)
        authStore.setPurposes(data.value?.purposes)
    })
    return {
        data, mutate
    }
}
