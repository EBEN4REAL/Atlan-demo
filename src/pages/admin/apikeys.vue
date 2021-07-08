<template>
  <div>
    <p class="mb-2 focus-within:text-2xl text-gray">API keys</p>
    <div class="pb-6 text-sm text-gray-400">Create, delete and access API Keys</div>
    <ListAPIKeys />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ListAPIKeys from "~/components/admin/apikeys/listApiKeys.vue";
import { useHead } from "@vueuse/head";
export default defineComponent({
  components: { ListAPIKeys },
  setup() {
    useHead({
      title: "API keys",
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
