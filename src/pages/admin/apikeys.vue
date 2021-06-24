<template>
  <div>
    <p class="mb-2 text-xl font-normal tracking-tight">API Keys</p>
    <ListAPIKeys />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ListAPIKeys from "~/components/admin/apikeys/listApiKeys.vue";
export default defineComponent({
  components: { ListAPIKeys },
  setup() {},
});
</script>
<style lang="less" module>
</style>
<route lang="yaml">
  meta:
  layout: default
  requiresAuth: true
  </route>