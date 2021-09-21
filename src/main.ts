import Vue, { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'

import { createHead } from '@vueuse/head'
import { inputFocusDirective } from '~/utils/directives/input-focus'
import App from './App.vue'

import '~/styles/index.less'

import { useTenantStore } from './store/tenants'

const app = createApp(App)
const head = createHead()

inputFocusDirective(app)

// setup up pages with layouts
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history: createWebHistory(), routes })

// auto install all the plugins in modules/* folder
Object.values(import.meta.globEager('./modules/*.ts')).map((i) =>
    i.install?.({ app, router, routes })
)
app.use(head)
app.use(router).mount('#app')

const fn = async () =>
    await app.config.globalProperties.$keycloak.init({
        pkceMethod: 'S256',
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/check-sso.html`,
    })

// const debug = process.env.NODE_ENV !== "production";
router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        // if first route
        if (!from.name) {
            try {
                const timeout = (prom: Promise<any>, time: number) =>
                    Promise.race([
                        prom,
                        new Promise((_r, rej) => setTimeout(rej, time)),
                    ])
                const auth = await timeout(fn(), 10000)
                const tenantStore = useTenantStore()
                if (auth) {
                    tenantStore.setIsAuthenticated(
                        true,
                        app.config.globalProperties.$keycloak.tokenParsed
                    )
                    next()
                    if (app.config.globalProperties?.$posthog?.capture) {
                        // Manually capturing pageview coz posthog does not capture pageviews if user changes tab/page in Atlan
                        app.config.globalProperties.$posthog.capture(
                            '$pageview'
                        )
                    }
                } else {
                    tenantStore.setIsAuthenticated(false, null)
                    window.location.replace(
                        app.config.globalProperties.$keycloak.createLoginUrl()
                    )
                }
            } catch (err) {
                console.log('login', err)
                console.dir('error in init', err)
                app.config.globalProperties.$error(
                    'Authentication Server is not available. Please try again'
                )

                // window.location.replace("/not-found");
            }
        } else if (app.config.globalProperties.$keycloak.authenticated) {
            // Manually capturing pageview coz posthog does not capture pageviews if user changes tab/page in Atlan
            if (
                Boolean(import.meta.env.VITE_ENABLE_EVENTS_TRACKING) &&
                app.config.globalProperties?.$posthog?.capture
            ) {
                app.config.globalProperties.$posthog.capture('$pageview')
            }
            next()
        } else {
            window.location.replace(
                app.config.globalProperties.$keycloak.createLoginUrl()
            )
        }
    } else {
        next()
    }
})
