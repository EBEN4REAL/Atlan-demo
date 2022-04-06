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
import { katexDirective } from './utils/directives/katex'
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

// auto install all the plugins in modules/* folder
Object.values(import.meta.globEager('./modules/*.ts')).map((i) => {
    i.install?.({ app, router, routes })
})
const keycloak = Keycloak({
    url: `${getBasePath()}/auth`,
    realm: getEnv().DEFAULT_REALM,
    clientId: getEnv().DEFAULT_CLIENT_ID,
})

/** Provide keycloak instance to the app so it's available globally */
app.config.globalProperties.$keycloak = keycloak
app.provide('$keycloak', keycloak)

/** Get tenant status */
const getTenantStatus = async () => {
    try {
        const result = await Tenant.GetTenantStatus()
        return result?.status ?? ''
    } catch (e) {
        console.error(e)
        return ''
    }
}

/** Initialize keycloak */
keycloak
    .init({
        pkceMethod: 'S256',
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/check-sso.html`,
    })
    .then(async (auth) => {
        authStore.setIsAuthenticated(auth)
        if (!auth) {
            /** check tenant status if user is not authenticated */
            const status = await getTenantStatus()
            if (status === 'register') {
                /** route to setup page  */
                app.use(router).mount('#app')
                router.push('/setup')
            } else if (status === 'ready') {
                /** route to login screen */
                const redirectURL = window.location.pathname
                localStorage.setItem('redirectURL', redirectURL)
                window.location.replace(keycloak.createLoginUrl())
            } else {
                /** route to error page */
                app.use(router).mount('#app')
                router.push('/error')
            }
        } else {
            /** Normal flow; user is authenticated */
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
            inputFocusDirective(app)
            authDirective(app)
            katexDirective(app)
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
    }
    if (to.path !== '/setup' && to.path !== '/error') {
        window.location.replace('/404')
    } else if (authStore.isAuthenticated && to.path === '/setup') {
        /** If a logged in user tries to access setup page, re-route to home page */
        next('/')
    }
    return next()
})
