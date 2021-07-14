<template>
  <div>
    <div class="flex flex-row items-center mb-0">
      <div>
        <component :is="asset.typeName" class="w-auto h-5 mr-2"></component>
      </div>
      <p
        class="mb-0 font-semibold leading-none tracking-wide truncate cursor-pointer  text-primary hover:underline"
      >
        {{ title(asset) }}
      </p>
      <StatusBadge
        :statusId="asset?.attributes?.assetStatus"
        class="ml-1"
        :key="asset.guid"
      ></StatusBadge>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AssetMixin from "~/mixins/asset";
import StatusBadge from "@common/badge/status/index.vue";
import RelationshipBadge from "@common/badge/relationship/index.vue";

export default defineComponent({
  mixins: [AssetMixin],
  props: ["asset"],
  components: { StatusBadge, RelationshipBadge },
  setup(props) {
    return {
      asset: props.asset,
    };
  },
});
</script>
