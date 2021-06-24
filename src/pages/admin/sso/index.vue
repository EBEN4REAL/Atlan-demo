<template>
  <div class="w-4/5 p-12 px-12 mx-auto my-8 text-gray-600 bg-white rounded">
    <DisplaySSO
      v-if="identityProviders.length"
      :providerDetails="providerDetails"
    />
    <EmptySSOScreen v-else @configureSSO="configureSSO" />
  </div>
</template>
  <script lang="ts">
import { useStore } from "vuex";
import { defineComponent, computed } from "vue";
import EmptySSOScreen from "@/admin/sso/configure/emptySSOScreen.vue";
import DisplaySSO from "@/admin/sso/update/displaySSO.vue";

export default defineComponent({
  components: {
    EmptySSOScreen,
    DisplaySSO,
  },
  setup() {
    const store = useStore();
    const tenantData = computed(() => store.state.tenant.data);
    const identityProviders: Array<any> =
      tenantData.value?.identityProviders || [];
    const configureSSO = (option: string) => {
      console.log("value from child", option);
    };

    const providerDetails = computed(() => identityProviders[0] || {});
    return {
      tenantData,
      identityProviders,
      configureSSO,
      providerDetails,
    };
  },
});
</script>
  <style lang="less" module>
.ssoPage {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
<route lang="yaml">
  meta:
  layout: default
  requiresAuth: true
  </route>