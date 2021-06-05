<template>
  <p class="leading-none mb-0" v-if="listCount === 0">
    <i class="fal fa-frown-open mr-1"></i>No {{ label }} found
  </p>
  <p class="leading-none mb-0" v-else>
    showing {{ listCount }} of
    <span class=""
      >{{ totalCount }}<span v-if="totalCount > 9999">~</span> {{ label }}</span
    >
  </p>
</template>
    
  <script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      required: false,
      default() {
        return "assets";
      },
    },
    limit: {
      type: Number,
      required: false,
      default() {
        return 10;
      },
    },
    offset: {
      type: Number,
      required: false,
      default() {
        return 0;
      },
    },
    totalCount: {
      type: Number,
      required: false,
      default() {
        return 0;
      },
    },
    listCount: {
      type: Number,
      required: false,
      default() {
        return 0;
      },
    },
  },
});
</script>
    
  <style scoped>
</style>