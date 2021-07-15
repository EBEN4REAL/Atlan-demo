<template>
  <div>
    <div class="flex flex-row items-center mb-0">
      <component :is="asset.typeName" class="w-auto h-6 mr-2"></component>
      <p
        class="mb-0 text-xl font-semibold leading-none tracking-wide text-gray-700 "
      >
        {{ title(asset) }}
      </p>
      <StatusBadge
        :statusId="asset?.attributes?.assetStatus"
        class="w-8 ml-2"
        :key="asset.guid"
      ></StatusBadge>
    </div>
    <div
      class="flex flex-row items-center content-center w-full p-2 space-x-4  justify-items-start"
    >
      <p class="flex items-center content-center mt-3.5">
        <img :src="logo(asset)" class="w-auto h-4 mr-2" />
        <RelationshipBadge :item="asset"></RelationshipBadge>
      </p>
      <p class="mb-0 text-gray-600">
        <span v-if="asset?.typeName.toLowerCase() === 'table'">
          <span class="font-bold tracking-wide text-gray-700"
            >~{{ rowCount(asset, true) }}</span
          >
          rows,
        </span>
        <span class="font-bold tracking-wide text-gray-700">{{
          columnCount(asset, true)
        }}</span>
        cols
      </p>
      <span class="text-gray-500">
        Created:
        <span class="text-gray-700">
          {{ dayjs().from(asset?.attributes?.__timestamp, true) }} ago,
          {{ asset?.attributes?.__createdBy }}
        </span>
      </span>
      <span class="text-gray-500">
        Last updated:
        <span class="text-gray-700">
          {{ dayjs().from(asset?.attributes?.__modificationTimestamp, true) }}
          ago,
          {{ asset?.attributes?.__modifiedBy }}
        </span>
      </span>
      <div class="text-xs text-gray-500">
        <fa icon="fal analytics" class="pushtop"></fa>
        {{ numeralFormat(asset?.attributes?.popularityScore, "0[.]00") }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AssetMixin from "~/mixins/asset";
import StatusBadge from "@common/badge/status/index.vue";
import RelationshipBadge from "@common/badge/relationship/index.vue";
import dayjs from "dayjs";

export default defineComponent({
  mixins: [AssetMixin],
  props: ["asset"],
  components: { StatusBadge, RelationshipBadge },
  setup(props) {
    return {
      asset: props.asset,
      dayjs,
    };
  },
});
</script>
