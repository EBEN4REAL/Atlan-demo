import { UserModule } from "~/types/vitessg";
import { VueKeycloakInstance } from "@dsb-norge/vue-keycloak-js/dist/types";

import Keycloak from "keycloak-js";
import { getEnv, getBasePath } from "./__env";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $keycloak: VueKeycloakInstance;
  }
}

// const debug = process.env.NODE_ENV !== "production";
export const install: UserModule = async ({ app }) => {
  const devBaseUrl = getBasePath();
  const defaultRealm = getEnv().DEFAULT_REALM;
  const clientId = getEnv().DEFAULT_CLIENT_ID;

  let initOptions = {
    url: `${devBaseUrl}/auth`,
    realm: defaultRealm,
    clientId: clientId,
    onLoad: "check-sso",
    silentCheckSsoRedirectUri: window.location.origin + '/public/check-sso.html'
  };
  let keycloak = Keycloak(initOptions);
  app.config.globalProperties.$keycloak = keycloak;
  setInterval(() => {
    keycloak
      .updateToken(70)
      .then((refreshed) => { })
      .catch((err) => { console.log(err) });
  }, 6000);
};
