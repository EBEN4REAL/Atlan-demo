<template>
  <div
    class="
      shadow-lg
      bg-white
      rounded-sm
      overflow-ellipsis
      h-52
      flex flex-col
      overflow-y-scroll
      border
      w-72
    "
    v-if="items.length"
  >
    <div
      v-for="(category, categoryIndex) in items"
      :key="category.categoryTitle"
    >
      <p v-if="category.content.length" class="p-2 m-0 ml-2 text-gray-500">
        {{ category.categoryTitle }}
      </p>
      <div
        class="item w-64"
        :class="{
          'is-selected':
            index === selectedIndex && categoryIndex === selectedCategoryIndex,
        }"
        v-for="(item, index) in category.content"
        :key="item.title"
        @click="selectItem(categoryIndex, index)"
      >
        <div class="flex">
          <div class="p-2 mr-2 flex border-2">
            <fa v-if="item.icon" :icon="item.icon" />
            <span v-else-if="item.textIcon" class="text-xs">{{
              item.textIcon
            }}</span>
          </div>
          <div class="flex flex-col justify-center">
            <div>{{ item.title }}</div>
            <div v-if="item.description" class="text-xs text-gray-400">
              {{ item.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedCategoryIndex: 0,
      selectedIndex: 0,
    };
  },

  watch: {
    items() {
      this.selectedIndex = 0;
      this.selectedCategoryIndex = 0;
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === "ArrowUp") {
        this.upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        this.downHandler();
        return true;
      }

      if (event.key === "Enter") {
        this.enterHandler();
        return true;
      }

      return false;
    },

    upHandler() {
      if (this.selectedIndex == 0) {
        this.selectedCategoryIndex -= 1;
        if (this.selectedCategoryIndex === -1) {
          this.selectedCategoryIndex = this.items.length - 1;
        }
        this.selectedIndex =
          this.items[this.selectedCategoryIndex].content.length - 1;
      } else {
        this.selectedIndex =
          (this.selectedIndex +
            this.items[this.selectedCategoryIndex].content.length -
            1) %
          this.items[this.selectedCategoryIndex].content.length;
      }
    },

    downHandler() {
      if (
        this.selectedIndex ==
        this.items[this.selectedCategoryIndex].content.length - 1
      ) {
        this.selectedCategoryIndex += 1;
        this.selectedIndex = 0;
        if (this.selectedCategoryIndex === this.items.length) {
          this.selectedCategoryIndex = 0;
        }
      } else {
        this.selectedIndex =
          (this.selectedIndex + 1) %
          this.items[this.selectedCategoryIndex].content.length;
      }
    },

    enterHandler() {
      this.selectItem(this.selectedCategoryIndex, this.selectedIndex);
    },

    selectItem(categoryIndex, index) {
      const item = this.items[categoryIndex].content[index];

      if (item) {
        this.command(item);
      }
    },
  },
});
</script>

<style lang="less" scoped>
.items {
  position: relative;
}

.item {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 0.2rem 0.5rem;

  &.is-selected,
  &:hover {
    @apply bg-gray-100;
  }
}
</style>