<template>
  <div class="flex flex-col px-2 space-y-3">
    <Terms :item="item" :key="item.guid"></Terms>

    <Classifications
      @unLinkClassification="unLinkClassification"
      :item="item"
      :key="item.guid"
    ></Classifications>
    <!-- <StatusBadge :status="status(item)" :key="item.guid"></StatusBadge> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Classifications from "./classifications/index.vue";
import Terms from "./terms.vue";

export default defineComponent({
  components: { Classifications, Terms },
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    const unLinkClassification = (classification) => {
      emit("unLinkClassification", classification);
    };
    return {
      unLinkClassification,
    };
  },
});
</script>

<style lang="less" module></style>
