<template>
  <div class="flex flex-col p-5">
    <div class="flex items-center mb-2 align-middle">
      <component :is="item.typeName" class="w-6 h-6 mr-1"></component>
      <p class="mb-0 text-sm font-bold leading-none truncate text-primary-400">
        {{ title(item) }}
      </p>
    </div>
    <div
      class="flex items-center text-xs tracking-wider uppercase align-middle"
    >
      <img :src="logo(item)" class="w-auto h-4 mr-1" />{{
        integrationName(item)
      }}
    </div>
  </div>
  <div class="flex mx-4">
    <a-tabs :class="$style.previewtab" v-model:activeKey="activeKey">
      <a-tab-pane :key="item.id" v-for="item in filteredTabList">
        <template #tab>
          <a-tooltip :title="item.description" placement="right">
            <p class="mb-0 text-center">
              <fa :icon="item.icon" class="mr-1" />
            </p> </a-tooltip
        ></template> </a-tab-pane
    ></a-tabs>
  </div>
  <div class="flex-grow py-3 overflow-y-auto">
    <component :is="activeKey" :item="item" :key="item.guid"></component>
  </div>
</template>
        
<script lang="ts">
import { defineAsyncComponent } from "vue";
import { computed, defineComponent, ref } from "vue";
import AssetMixin from "~/mixins/asset";
// import PreviewTabs from "./tabs/index.vue";
import { List } from "./list";

export default defineComponent({
  mixins: [AssetMixin],
  components: {
    Overview: defineAsyncComponent(() => import("./tabs/overview/index.vue")),
    Audit: defineAsyncComponent(() => import("./tabs/audit/index.vue")),
    Columns: defineAsyncComponent(() => import("./tabs/columns/index.vue")),
  },
  props: {
    item: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  setup() {
    const activeKey = ref("overview");
    const filteredTabList = computed(() => {
      return List;
    });
    return {
      activeKey,
      filteredTabList,
    };
  },
});
</script>

<style lang="less" module>
.previewtab {
  :global(.ant-tabs-tab) {
    padding: 6px 8px !important;
    max-width: 60px !important;
    margin-right: 4px !important;
  }
  :global(.ant-tabs-bar) {
    margin-bottom: 0px;
  }
}
</style>