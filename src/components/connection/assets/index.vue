<template>
  <div class="flex h-full">
    <div class="flex flex-col w-1/4 h-full overflow-hidden border-r bg-gray-50">
      <div class="flex flex-grow w-full px-4 mt-3 mb-2 overflow-y-auto">
        <a-menu mode="inline" :class="$style.sidebar" class="bg-gray-50">
          <a-menu-item key="metadata"> Assets </a-menu-item>
          <a-menu-item key="adoption"> Adoption </a-menu-item>
          <a-menu-item key="lineage"> Lineage </a-menu-item>
          <a-menu-item key="testsuites"> Data Quality </a-menu-item>

          <a-menu-item-group class="mb-3" title="Custom">
            <a-menu-item key="classifications"> Custom 1 </a-menu-item>
            <a-menu-item key="metadata polcies"> Custom 2 </a-menu-item>
            <a-menu-item key="data policies"> Custom 3 </a-menu-item>
          </a-menu-item-group>
        </a-menu>
      </div>
    </div>
    <div class="w-3/4">
      <Assets></Assets>
    </div>
  </div>
</template>
          
<script lang="ts">
import { defineComponent, PropType } from "vue";

import Assets from "./assets.vue";

export default defineComponent({
  name: "HelloWorld",
  components: { Assets },
  props: {
    item: {
      type: Object as PropType<ConnectionType>,
      required: false,
      default(): any {
        return {};
      },
    },
    credential: {
      type: Object as PropType<CredentialType>,
      required: false,
      default(): any {
        return {};
      },
    },
    bot: {
      type: Object as PropType<BotsType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  data() {
    return {};
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
          