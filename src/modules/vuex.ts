import { UserModule } from "~/types/vitessg";

import { store, Store } from "~/store";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
  }
}

export const install: UserModule = ({ app }) => {
  app.use(store);
};
