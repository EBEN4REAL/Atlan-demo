<template>
  <div class="w-full">
    Data Profile
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, toRaw, Ref, watch } from "vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {},
  props: {
    id: String,
  },
  setup(props) {
    useHead({
      title: "Query Playground",
    });

    return {};
  },
});
</script>

<style lang="less" scoped>
.view {
  border: 3px solid white;
  margin-left: -8px;
}
</style>

<route lang="yaml">
        meta:
          layout: default
          requiresAuth: true
      </route>
