<template>
  <div class="flex flex-col">
    <div class="flex items-center align-middle px-4 py-3 border-b">
      <div class="">
        <component :is="item.typeName" class="h-6 w-6 mr-1"></component>
      </div>
      <div class="flex flex-col w-full">
        <div class="flex items-center mb-0 justify-between">
          <p
            class="mb-0 text-blue-600 font-semibold text-sm truncate leading-none"
          >
            {{ title(item) }}
          </p>
          <StatusBadge
            :status="status(item)"
            class="ml-1"
            :key="item.guid"
          ></StatusBadge>
        </div>
        <div class="flex items-center">
          <div>
            <!-- <StatusBadge
              :status="status(item)"
              class="ml-1"
              :key="item.guid"
            ></StatusBadge> -->
          </div>
        </div>
      </div>
    </div>
    <div class="flex mx-4">
      <PreviewTabs></PreviewTabs>
    </div>
    <div class="flex-grow mt-3">
      <Overview :item="item"></Overview>
    </div>
  </div>
</template>
        
  <script lang="ts">
import { defineComponent, PropType } from "vue";
import AssetMixin from "~/mixins/asset";

import PreviewTabs from "./tabs/index.vue";
import Overview from "./tabs/overview/index.vue";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  mixins: [AssetMixin],
  components: {
    PreviewTabs,
    Overview,
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
  data() {
    return {};
  },
  methods: {},
});
</script>