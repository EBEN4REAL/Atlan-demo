<template>
  <a-collapse
    :bordered="false"
    :class="$style.filter"
    :accordion="false"
    class="bg-gray-100"
  >
    <a-collapse-panel key="details" class="bg-gray-100">
      <template #header>
        <div class="flex items-center justify-between">
          <div>Details</div>
          <a class="text-xs">edit</a>
        </div>
      </template>
      <Details :item="item"></Details>
    </a-collapse-panel>
    <a-collapse-panel key="properties" class="bg-gray-100">
      <template #header>
        <div class="flex items-center justify-between">
          <div>Heirarchy</div>
        </div>
      </template>
      <!-- <Properties :item="item"></Properties> -->
      <Heirarchy :item="item"></Heirarchy>
    </a-collapse-panel>
  </a-collapse>
</template>
          
    <script lang="ts">
import { defineComponent, PropType } from "vue";
import AssetMixin from "~/mixins/asset";
import Details from "./details/index.vue";
// import Properties from "./properties/index.vue";
import { Components } from "~/api/atlas/client";
import Heirarchy from "./heirarchy/index.vue";

export default defineComponent({
  mixins: [AssetMixin],
  components: { Details, Heirarchy },
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


   
<style lang="less" module>
.filter {
  :global(.ant-collapse-item) {
    @apply border-none;
    // padding: 8px 12px !important;
    // max-width: 60px !important;
    //   min-height: 48px !important;
    //   line-height: 40px;
  }

  :global(.ant-collapse-content-box) {
    @apply px-1 py-0;
  }
}
</style>
        