<template>
  <div>
    <p class="text-2xl text-gray">API keys</p>
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
