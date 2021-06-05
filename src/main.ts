
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import App from './App.vue'


import "~/styles/tailwind.css";
import "ant-design-vue/dist/antd.less";
import "~/styles/main.less";
import "~/styles/antd.less";


import { useStore } from "~/store";

import { ActionTypes as ConnectionActionTypes } from "~/store/modules/connection/types-action";
import { ActionTypes as TenantActionTypes } from "~/store/modules/tenant/types-action";

const app = createApp(App)

// setup up pages with layouts
const routes = setupLayouts(generatedRoutes)
const router = createRouter({ history: createWebHistory(), routes })

Object.values(import.meta.globEager('./modules/*.ts')).map(i => i.install?.({ app, router, routes }))

app.use(router).mount('#app');

const fn = async () => {
  return await app.config.globalProperties.$keycloak.init({
    pkceMethod: "S256",
    // Use 'login-required' to always require authentication
    // If using 'login-required', there is no need for the router guards in router.js
    onLoad: "check-sso",
    enableLogging: true,
    loginHint: "",
    silentCheckSsoRedirectUri: window.location.origin + "/check-sso.html",
  });
};

// const debug = process.env.NODE_ENV !== "production";
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!from.name) {
      try {
        // await setTimeout(() => {}, 200);
        const timeout = (prom: Promise<any>, time: number) =>
          Promise.race([
            prom,
            new Promise((_r, rej) => setTimeout(rej, time)),
          ]);
        const auth = await timeout(fn(), 10000);
        if (auth) {
          const store = useStore();
          store.dispatch(ConnectionActionTypes.CONNECTION_FETCH_LIST);
          store.dispatch(TenantActionTypes.TENANT_GET_TENANT);
          next();
        } else {

          console.log(app.config.globalProperties.$keycloak.createLoginUrl());
          window.location.replace(
            app.config.globalProperties.$keycloak.createLoginUrl()
          );
        }
      } catch (err) {
        console.log("error in init", err);
        app.config.globalProperties.$error(err);
        window.location.replace("/not-found");
        // next();
      }
    } else {
      if (app.config.globalProperties.$keycloak.authenticated) {
        next();
      } else {
        window.location.replace(
          app.config.globalProperties.$keycloak.createLoginUrl()
        );
      }
    }
  } else {
    next();
  }
});

