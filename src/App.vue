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
import { Classification } from "~/api/atlas/classification";
import { useClassificationStore } from "~/components/admin/classifications/_store";

function getClassifications(classificationsStore) {
  classificationsStore.setClassificationsStatus("loading");

  const {
    data: classificationData,
    error: classificationError,
  } = Classification.getClassificationList({ cache: false });

  watch([classificationData, classificationError], () => {
    if (classificationData.value) {
      let classifications = classificationData.value.classificationDefs || [];
      classifications = classifications.map((classification) => {
        classification.alias = classification.name;
        return classification;
      });
      classificationsStore.setClassifications(classifications ?? []);
      classificationsStore.initializeFilterTree();
      classificationsStore.setClassificationsStatus("success");
    } else {
      classificationsStore.setClassificationsStatus("error");
    }
  });
}

export default defineComponent({
  setup(props, context) {
    //Initalise PostHog
    posthog.init("phc_nrHzT0y0X5GKUHPzUkhPXqrqxcRQl5JPEUvQ8BqbEiS", {
      api_host: "https://app.posthog.com",
    });

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

    // get classifications
    const classificationsStore = useClassificationStore();

    watch(
      () => tenantStore.isAuthenticated,
      () => {
        isAuth.value = true;
        posthog.identify(tenantStore.token.userId);
        posthog.people.set({ email: tenantStore.token.email });
      }
    );

    watch(tenantData, () => {
      tenantStore.setData(tenantData.value);
      getClassifications(classificationsStore);
    });

    return {
      tenantData,
    };
  },
});
</script>
