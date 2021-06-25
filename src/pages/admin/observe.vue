<template>
  <div>
    <p class="mb-2 text-xl font-normal tracking-tight">Observe page</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useHead } from "@vueuse/head";

export default defineComponent({
  setup() {
    useHead({
      title: "Observe",
    });
  },
});
</script>
<style lang="less" module></style>
<route lang="yaml">
  meta:
  layout: default
  requiresAuth: true
  </route>
