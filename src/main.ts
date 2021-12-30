import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createHead } from '@vueuse/head'
import Keycloak from 'keycloak-js'
import { createPinia } from 'pinia'

import App from './App.vue'

import '~/styles/antd.less'
import '~/styles/index.less'

import { getBasePath, getEnv } from './modules/__env'
import { useAuthStore } from '~/store/auth'
import { inputFocusDirective } from '~/utils/directives/input-focus'
import { authDirective } from './utils/directives/auth'
import { useTenantStore } from '~/store/tenant'

const app = createApp(App)
//initialize store
app.use(createPinia())
//vue-head
const head = createHead()
app.use(head)

const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history: createWebHistory(), routes })
const authStore = useAuthStore()

const keycloak = Keycloak({
    url: `${getBasePath()}/auth`,
    realm: getEnv().DEFAULT_REALM,
    clientId: getEnv().DEFAULT_CLIENT_ID,
})

keycloak
    .init({
        pkceMethod: 'S256',
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/check-sso.html`,
    })
    .then(async (auth) => {
        authStore.setIsAuthenticated(auth)
        if (!auth) {
            window.location.replace(keycloak.createLoginUrl())
        } else {
            authStore.setToken({
                token: keycloak.token,
                decodedToken: keycloak.tokenParsed,
            })

            keycloak.onAuthRefreshSuccess = () =>
                authStore.setToken({
                    token: keycloak.token,
                    decodedToken: keycloak.tokenParsed,
                })

            keycloak.onTokenExpired = async () => {
                try {
                    await keycloak.updateToken(60)
                    authStore.setToken({
                        token: keycloak.token,
                        decodedToken: keycloak.tokenParsed,
                    })
                } catch (error) {
                    authStore.setFailed(true)
                }
            }

            setInterval(() => {
                keycloak.updateToken(60)
            }, 6000)

            app.config.globalProperties.$keycloak = keycloak
            app.provide('$keycloak', keycloak)

            // auto install all the plugins in modules/* folder
            Object.values(import.meta.globEager('./modules/*.ts')).map((i) => {
                i.install?.({ app, router, routes })
            })
            inputFocusDirective(app)
            authDirective(app)
            if ((window as any).analytics) {
                const tenantStore = useTenantStore()
                const domain = window.location.host
                const groupId = domain
                // identify
                if ((window as any).analytics.identify) {
                    ;(window as any).analytics.identify(authStore?.id, {
                        name: authStore.name || '',
                        firstName: authStore.firstName,
                        lastName: authStore.lastName,
                        email: authStore.email || '',
                        username: authStore.username || '',
                        roles: authStore.roles || [],
                    })
                }
                // group
                if ((window as any).analytics.group) {
                    ;(window as any).analytics.group(groupId, {
                        tenant_domain: domain,
                        tenant_name: tenantStore.displayName,
                    })
                }
            }

            app.use(router).mount('#app')
        }
    })
    .catch(() => {
        authStore.setFailed(true)
        authStore.setIsAuthenticated(false)
    })

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (authStore.isAuthenticated) {
            const requiredRole = to.matched.find((record) => !!record.meta.role)
                ?.meta.role
            if (requiredRole) {
                const allRoles = authStore.decodedToken?.realm_access?.roles
                if (allRoles?.length && allRoles.includes(requiredRole))
                    return next()
                return next(false)
            }
            return next()
        }
        return window.location.reload()
    } else {
        window.location.replace('/404')
    }
    return next()
})
