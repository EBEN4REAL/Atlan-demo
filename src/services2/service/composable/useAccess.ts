import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import { Access } from '~/services2/service/access'

import { watch } from 'vue'
import { useAuthStore } from '~/store/auth'

interface EvaluateAssetInterface {
    entityGuid: string
    typeName: string
}

export default function useAccess(
    assets: EvaluateAssetInterface | EvaluateAssetInterface[],
    actions: string | string[]
) {
    // const { data, isReady } = Access.Evaluate({
    //     cacheKey: 'DEFAULT_PERMISSIONS',
    //     cache: {
    //         shouldRetryOnError: false,
    //         revalidateOnFocus: false,
    //         cache: new LocalStorageCache(),
    //         dedupingInterval: 1,
    //     },
    // })
    // const authStore = useAuthStore()
    // watch(data, () => {
    //     console.log(data.value?.permissions)
    //     authStore.setPermissions(data.value?.permissions)
    // })
    // return {
    //     data,
    //     isReady,
    // }
}
