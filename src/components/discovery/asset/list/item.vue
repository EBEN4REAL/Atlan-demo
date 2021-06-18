<template>
  <div
    class="px-4 py-3 my-1 bg-white border border-gray-200 rounded-md  hover:border hover:border-primary-500 hover:bg-blue-50 hover:-translate-y-1 hover:shadow-lg"
  >
    <div class="flex items-center justify-between mb-1 align-middle">
      <div class="flex items-center mr-1 align-middle">
        <div class="">
          <component :is="item.typeName" class="w-auto h-5 mr-2"></component>
        </div>
        <div class="flex flex-col w-full">
          <div class="flex items-center justify-between mb-0">
            <p
              class="mb-0 font-semibold leading-none tracking-wide truncate  text-primary-500 hover:underline"
            >
              {{ title(item) }}
            </p>
            <StatusBadge
              :statusId="item?.attributes?.assetStatus"
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
      <img :src="logo(item)" class="w-auto h-5" />
    </div>
    <p class="mb-0 text-xs text-gray-500">
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