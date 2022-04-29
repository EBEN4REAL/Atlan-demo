//WARNING: We use our own CDN not the default one from Segment. Mindful when you change

import userflow from 'userflow.js'
import { UserModule } from '~/types/vitessg'
import { useAuthStore } from '~/store/auth'

const addDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

export const install: UserModule = async () => {
    const userflowKey = import.meta.env.VITE_USERFLOW_KEY || ''
    const userflowDomains =
        import.meta.env.VITE_USERFLOW_WHITELISTED_DOMAINS || ''
    const domain = window.location.hostname
    if (userflowKey && userflowDomains && userflowDomains.includes(domain)) {
        await addDelay(2000)
        userflow.init(userflowKey)
        const authStore = useAuthStore()
        console.log('sending userflow', {
            userflowDomains,
            userflowKey,
            userCreatedAt: authStore.createdAt,
            id: authStore?.id,
        })
        userflow.identify(authStore?.id, {
            username: authStore.username || '',
            email: authStore.email || '',
            signed_up_at: authStore.createdAt
                ? authStore.createdAt.toISOString()
                : '',
        })
    }
}
