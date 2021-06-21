<template>
  <DynamicScroller
    ref="itemscroll"
    :items="list"
    :keyField="keyField"
    :minItemSize="minItemSize"
    class="mx-6 border scroller"
    :buffer="1000"
  >
    <template v-slot="{ item, index, active }">
      <DynamicScrollerItem
        :item="item"
        :active="active"
        :data-index="index"
        class="border-b border-gray-200"
      >
        <ListItem
          :item="item"
          @click="handlePreview(item)"
          :projection="projection"
        ></ListItem>
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
        return 100;
      },
    },
    keyField: {
      type: String,
      required: false,
      default() {
        return "guid";
      },
    },
    projection: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  emits: ["preview"],
  methods: {
    handlePreview(item) {
      this.$emit("preview", item);
    },
    scrollToItem() {
      if (this.$refs.itemscroll) {
        console.log("scrol");
        this.$refs.itemscroll.scrollToItem(0);
      }
    },
  },
});
</script>
    
<style lang="less">
.scroller {
  height: 100%;
  overflow-y: auto;

  .vue-recycle-scroller__item-wrapper {
    .vue-recycle-scroller__item-view:last-child {
      @apply border-b;
    }
  }
}
</style>


