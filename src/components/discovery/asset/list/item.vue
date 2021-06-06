<template>
  <div class="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
    <div class="flex items-center justify-between align-middle">
      <div class="flex items-center mr-1 align-middle">
        <div class="">
          <component :is="item.typeName" class="w-6 h-6 mr-1"></component>
        </div>
        <div class="flex flex-col w-full">
          <div class="flex items-center justify-between mb-0">
            <p
              class="mb-0 text-sm font-semibold leading-none tracking-wide text-blue-600 truncate  hover:underline"
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
      <img :src="logo(item)" class="w-auto h-5 mr-2" />
    </div>
    <p class="mb-0 text-xs text-gray-400">
      {{ description(item) }}
    </p>
    <RelationshipBadge :item="item" class="mt-1"></RelationshipBadge>
  </div>
</template>
      
<script lang="ts">
import { defineComponent, PropType } from "vue";
import AssetMixin from "~/mixins/asset";

import StatusBadge from "@common/badge/status/index.vue";
import RelationshipBadge from "@common/badge/relationship/index.vue";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  mixins: [AssetMixin],
  components: {
    StatusBadge,
    RelationshipBadge,
  },
  props: {
    item: {
      type: Object as PropType<Components.Schemas.AtlasEntityHeader>,
      required: false,
      default(): Components.Schemas.AtlasEntityHeader {
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