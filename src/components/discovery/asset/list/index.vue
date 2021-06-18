<template>
  <DynamicScroller
    :items="list"
    :keyField="keyField"
    :minItemSize="minItemSize"
    class="px-6 scroller"
    :buffer="400"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem :item="item" :active="active" :data-index="index">
        <ListItem :item="item" @click="handlePreview(item)"></ListItem>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
    
<script lang="ts">
import { defineComponent, PropType } from "vue";
import ListItem from "./item.vue";

export default defineComponent({
  components: {
    ListItem,
  },
  props: {
    list: {
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
        return 75;
      },
    },
    keyField: {
      type: String,
      required: false,
      default() {
        return "guid";
      },
    },
  },
  emits: ["preview"],
  methods: {
    handlePreview(item) {
      this.$emit("preview", item);
    },
  },
});
</script>
    
  <style scoped>
.scroller {
  height: 100%;
  overflow-y: auto;
}
</style>