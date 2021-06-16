<template>
  <div class="flex w-full h-full">
    <div class="flex flex-col w-1/5 h-full overflow-hidden bg-white border-r">
      <div class="px-4 py-4 pb-2">
        <p class="mb-0 text-2xl">Admin Centre</p>
      </div>

      <div class="flex flex-grow w-full px-4 mb-2 overflow-y-auto">
        <a-menu mode="inline" :class="$style.sidebar" @click="handleClick">
          <a-menu-item-group class="mb-3" title="Workspace">
            <a-menu-item key="general"> General </a-menu-item>

            <a-menu-item key="members"> Members </a-menu-item>
            <a-menu-item key="groups">Groups</a-menu-item>
            <a-menu-item key="apikeys"> API Keys </a-menu-item>
            <a-menu-item key="integrations"> Integrations </a-menu-item>
            <a-menu-item key="billing"> Billing & License </a-menu-item>
          </a-menu-item-group>

          <a-menu-item-group class="mb-3" title="Access Control">
            <a-menu-item key="classifications"> Classifications </a-menu-item>
            <a-menu-item key="metadata polcies">
              Metadata Policies
            </a-menu-item>
            <a-menu-item key="data policies"> Data Policies </a-menu-item>
            <a-menu-item key="sso">SSO</a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group class="mb-3" title="Metadata Management">
            <a-menu-item key="business-metadata"> Business Metadata </a-menu-item>
            <a-menu-item key="enums"> Enums </a-menu-item>
          </a-menu-item-group>
          <a-menu-item-group class="mb-3" title="Cloud & Compliance">
            <a-menu-item key="accesslogs"> Access Logs </a-menu-item>
            <a-menu-item key="auditlogs"> Audit Logs </a-menu-item>
            <a-menu-item key="releases"> Releases </a-menu-item>
            <a-menu-item key="health"> Health Status </a-menu-item>
            <a-menu-item key="observe"> Observability </a-menu-item>
          </a-menu-item-group>
        </a-menu>
      </div>
    </div>
    <div class="w-4/5 max-h-screen p-6 overflow-y-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const handleClick = (e: Event) => {
      router.push("/admin/" + e.key);
    };

    return {
      handleClick,
    };
  },
});
</script>

<style lang="less" module>
.sidebar {
  &:global(.ant-menu-inline) {
    @apply border-none !important;
  }

  :global(.ant-menu-item-group-title) {
    @apply px-0;
  }

  :global(.ant-menu-item) {
    height: 32px;
    line-height: 32px;
  }

  :global(.ant-menu-item::after) {
    @apply border-none !important;
  }

  :global(.ant-menu-item-selected) {
    @apply rounded !important;
  }
}
</style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
