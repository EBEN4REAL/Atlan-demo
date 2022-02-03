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
import { Tenant } from '~/services/service/tenant'

import {
    identifyGroup,
    identifyUser,
} from './composables/eventTracking/useAddEvent'

const app = createApp(App)
app.use(createPinia())
// vue-head
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

const getTenantStatus = async () => {
    try {
        const status = await Tenant.GetTenantStatus()
        return status
    } catch (e) {
        return ''
    }
}
keycloak
    .init({
        pkceMethod: 'S256',
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/check-sso.html`,
    })
    .then(async (auth) => {
        authStore.setIsAuthenticated(auth)
        if (!auth) {
            const status = getTenantStatus()
            if (status === 'register') router.push('/setup')
            else if (status === 'ready') {
                const redirectURL = window.location.pathname
                localStorage.setItem('redirectURL', redirectURL)
                window.location.replace(keycloak.createLoginUrl())
            } else router.push('/404')
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
            app.use(router).mount('#app')
            const redirectUrl = localStorage.getItem('redirectURL')
            if (redirectUrl) {
                router.push(redirectUrl)
                localStorage.setItem('redirectURL', '')
            }
            identifyUser()
            identifyGroup()
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
