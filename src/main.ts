import Vue, { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import generatedRoutes from "virtual:generated-pages";
import { setupLayouts } from "virtual:generated-layouts";
import { VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js/dist/types";
import { createPinia } from "pinia";
import App from "./App.vue";

import "~/styles/index.less";

import { TENANT_FETCH_DATA } from "./constant/store_types";
import { useStore } from "~/store";

const app = createApp(App);

// setup up pages with layouts
const routes = setupLayouts(generatedRoutes);
const router = createRouter({ history: createWebHistory(), routes });

//auto install all the plugins in modules/* folder
Object.values(import.meta.globEager("./modules/*.ts")).map((i) =>
  i.install?.({ app, router, routes })
);

app.use(router).mount("#app");
app.use(createPinia());

const fn = async () => {
  return await app.config.globalProperties.$keycloak.init({
    pkceMethod: "S256",
    onLoad: "check-sso",
    silentCheckSsoRedirectUri: window.location.origin + "/check-sso.html",
  });
};

// const debug = process.env.NODE_ENV !== "production";
router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!from.name) {
      try {
        const timeout = (prom: Promise<any>, time: number) =>
          Promise.race([prom, new Promise((_r, rej) => setTimeout(rej, time))]);
        const auth = await timeout(fn(), 10000);
        if (auth) {
          const store = useStore();
          store.dispatch(TENANT_FETCH_DATA);
          next();
        } else {
          console.log("login");
          window.location.replace(
            app.config.globalProperties.$keycloak.createLoginUrl()
          );
        }
      } catch (err) {
        console.log("login", err);
        console.dir("error in init", err);
        app.config.globalProperties.$error(
          "Authentication Server is not available. Please try again"
        );
        return;
        // window.location.replace("/not-found");
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
