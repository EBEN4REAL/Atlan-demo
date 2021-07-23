<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, ref, watch, inject } from "vue";
import LocalStorageCache from "swrv/dist/cache/adapters/localStorage";
import { Tenant } from "./api2/tenant";

import { useConnectionsStore } from "./pinia/connections";
import useConnectionsList from "./composables/bots/useConnectionList";

import { CONNECTION_FETCH_LIST } from "./constant/cache";
import { useTenantStore } from "./pinia/tenants";
import { useClassificationStore } from "~/components/admin/classifications/_store";
import useTracking from "~/modules/tracking";

export default defineComponent({
  setup(props, context) {
    const tracking = useTracking();
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
    useClassificationStore();

    watch(
      () => tenantStore.isAuthenticated,
      () => {
        isAuth.value = true;
        tracking.initialize({
          analyticsName: "posthog",
          user: {
            userId: tenantStore?.token?.userId,
            email: tenantStore?.token?.email ?? "",
            name: tenantStore?.token?.name ?? "",
            username: tenantStore?.token?.username ?? "",
            roleCode: tenantStore?.token?.roleCode ?? "",
          },
        });
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
