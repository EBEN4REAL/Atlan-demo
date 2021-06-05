<template>
  <DynamicScroller
    :items="items"
    :itemSize="itemSize"
    :keyField="keyField"
    :minItemSize="minItemSize"
    class="scroller"
  >
    <!-- <template #before>
      <slot name="before"></slot>
    </template> -->

    <template v-slot="{ item, index, active }">
      {{ item.guid }}
      <!-- <slot name="default" :item="item" :index="index" :active="active"> </slot> -->
    </template>
    <!-- <template #after>
      <slot name="after"></slot>
    </template> -->
  </DynamicScroller>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    itemSize: {
      type: Number,
      required: false,
      default() {
        return null;
      },
    },
    minItemSize: {
      type: Number,
      required: false,
      default() {
        return null;
      },
    },
    keyField: {
      type: String,
      required: false,
      default() {
        return "id";
      },
    },
  },
});
</script>
  
<style scoped>
.scroller {
  height: 100%;
  overflow: auto;
}
</style>