import { createStore, createLogger } from "vuex";
import createPersistedState from "vuex-persistedstate";

import { groups } from "~/store/modules/admin/groups"
// import { connection } from "~/store/modules/connection"

// TODO: How to surpass cyclical dependency linting errors cleanly?
// eslint-disable-next-line import/no-cycle
// import {
//   store as entitydefmodule,
//   Store as EntitydefStore,
//   State as EntitydefState,
// } from "~/store/modules/entitydef";

// import {
//   store as connectionmodule,
//   Store as ConnectionStore,
//   State as ConnectionState,
// } from "~/store/modules/connection";

// import {
//   store as connectormodule,
//   Store as ConnectorStore,
//   State as ConnectorState,
// } from "~/store/modules/connector";

// import {
//   store as tenantmodule,
//   Store as TenantStore,
//   State as TenantState,
// } from "~/store/modules/tenant";

// import {
//   store as searchmodule,
//   Store as SearchStore,
//   State as SearchState,
// } from "~/store/modules/search";

// export type RootState = {
//   entitydef: EntitydefState;
//   // connection: ConnectionState;
//   connector: ConnectorState;
//   tenant: TenantState;
//   search: SearchState;

// };

// export type Store = EntitydefStore<Pick<RootState, "entitydef">> &
//   ConnectionStore<Pick<RootState, "connection">> &
//   TenantStore<Pick<RootState, "tenant">> &
//   SearchStore<Pick<RootState, "search">> &
//   ConnectorStore<Pick<RootState, "search">>;

// Plug in logger when in development environment
const plugins = true ? [createLogger({})] : [];

// Plug in session storage based persistence
// plugins.push(createPersistedState({ storage: window.localStorage }));

export const store = createStore({
  plugins,
  modules: {
    // entitydefmodule,
    // connectionmodule,
    // tenantmodule,
    // searchmodule,
    groups,

  },
});

export function useStore() {
  return store
}
