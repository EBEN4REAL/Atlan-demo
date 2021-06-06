<template>
  <div class="flex flex-wrap items-center align-middle">
    <div class="flex flex-wrap items-center text-gray-500">
      <!-- <img
        :src="getConnectorImage(getConnectorName(item))"
        :class="$style.assetConnectionImage"
        class="mr-1"
      /> -->
      <!-- <div>{{ relationshipList(item) }}</div> -->

      <template v-for="(part, index) in qArray" :key="part.id">
        <div class="text-xs tracking-tight text-gray-500">
          <a-tooltip placement="bottom" :title="part.label">
            <span :class="index == qArray.length - 1 ? 'font-semibold' : ''">{{
              part.value
            }}</span></a-tooltip
          >
          <span v-if="index !== qArray.length - 1" class="mx-1 text-gray-300">
            <fa icon="fal chevron-right"></fa>
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import AssetMixin from "~/mixins/asset";

export default defineComponent({
  mixins: [AssetMixin],
  props: {
    item: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  computed: {
    qArray(): any[] {
      return this.relationshipList(this.item);
    },
  },
});
</script>
  
  <style lang="less" module>
.assetConnectionImage {
  width: auto;
  height: 14px;
}
</style>
  