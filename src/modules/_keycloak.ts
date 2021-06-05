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

  console.error(devBaseUrl);
  console.error(defaultRealm);
  console.error(clientId);


  let initOptions = {
    url: `${devBaseUrl}/auth`,
    realm: defaultRealm,
    clientId: clientId,
    onLoad: "login-required",
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
