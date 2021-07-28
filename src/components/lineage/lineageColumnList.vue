<template>
  <div class="column-list" v-if="columnsList.length > 0">
    <div
      class="column-list__item"
      v-for="(item, index) in columnsList"
      :key="index"
    >
      {{ item.displayText }}
    </div>
  </div>
</template>

<script lang="ts">
// Vue
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {
      columnsList: [],
    };
  },
});
</script>

<style lang="less" scoped>
.column-list {
  background: white;
  margin-left: 15px;
  margin-top: 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 1px;
    height: 100%;
    background: #e5e5e5;
    left: -13px;
  }

  &__item {
    padding: 8px;

    &:hover {
      background: #e7f4ff;
    }
  }
}
</style>
