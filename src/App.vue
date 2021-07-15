<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import LocalStorageCache from "swrv/dist/cache/adapters/localStorage";
import posthog from "posthog-js";
import { Tenant } from "./api2/tenant";

import { useConnectionsStore } from "./pinia/connections";
import useConnectionsList from "./composables/bots/useConnectionList";

import { CONNECTION_FETCH_LIST } from "./constant/cache";
import { useTenantStore } from "./pinia/tenants";

export default defineComponent({
  setup(props, context) {
    //Initalise PostHog
    // posthog.init("phc_nrHzT0y0X5GKUHPzUkhPXqrqxcRQl5JPEUvQ8BqbEiS", {
    //   api_host: "https://app.posthog.com",
    // });

    const tenantStore = useTenantStore();
    const asyncOptions = {
      dedupingInterval: 0,
      shouldRetryOnError: false,
      revalidateOnFocus: false,
      cache: new LocalStorageCache(),
    };

    const isAuth = ref(false);
    const { data: tenantData } = Tenant.GetTenant(
      asyncOptions,
      ref(""),
      isAuth
    );

    const initialBody = {
      limit: 100,
    };

    useConnectionsList(isAuth, initialBody, CONNECTION_FETCH_LIST);

    watch(
      () => tenantStore.isAuthenticated,
      () => {
        isAuth.value = true;
        //posthog.identify(tenantStore.token.userId);
        //posthog.people.set({ email: tenantStore.token.email });
      }
    );

    watch(tenantData, () => {
      tenantStore.setData(tenantData.value);
    });

    return {
      tenantData,
    };
  },
});
</script>

