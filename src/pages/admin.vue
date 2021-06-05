<template>
  <div class="grid grid-cols-12 h-full">
    <div class="col-span-3 h-full bg-white border-r">
      <div class="p-4">
        <p class="text-2xl">Admin Centre</p>
      </div>

      <a-menu mode="inline" :class="$style.sidebar" class="px-4">
        <a-menu-item-group class="mb-3 text-gray-500"
          >Workspace</a-menu-item-group
        >
        <a-menu-item key="general"> General </a-menu-item>
        <!-- Image/Name/Preferences -->

        <a-menu-item key="members"> Members </a-menu-item>
        <a-menu-item key="groups"> Groups </a-menu-item>
        <a-menu-item key="apikeys"> API Keys </a-menu-item>
        <a-menu-item key="integrations"> Integrations </a-menu-item>
        <a-menu-item key="billing"> Billing & License </a-menu-item>
        <!-- SSO/SMTP -->

        <a-menu-item-group class="mb-3 text-gray-500"
          >Access Control</a-menu-item-group
        >
        <a-menu-item key="classifications"> Classifications </a-menu-item>
        <a-menu-item key="metadata polcies"> Metadata Policies </a-menu-item>
        <a-menu-item key="data policies"> Data Policies </a-menu-item>

        <a-menu-item-group class="mb-3 text-gray-500"
          >Metadata Management</a-menu-item-group
        >
        <a-menu-item key="bm"> Business Metadata </a-menu-item>
        <a-menu-item key="enum"> Enums </a-menu-item>

        <a-menu-item-group class="mb-3 text-gray-500"
          >Cloud & Compliance</a-menu-item-group
        >
        <a-menu-item key="accesslogs"> Access Logs </a-menu-item>
        <a-menu-item key="auditlogs"> Audit Logs </a-menu-item>
        <a-menu-item key="releases"> Releases </a-menu-item>
        <a-menu-item key="health"> Health Status </a-menu-item>
        <a-menu-item key="observe"> Observability </a-menu-item>
      </a-menu>
    </div>
    <div class="col-span-9"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
export default defineComponent({});
</script>


<style lang="less" module>
.sidebar {
  &:global(.ant-menu-inline) {
    @apply border-none !important;
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