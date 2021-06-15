<template>
  <div class="p-4">
    <h1 class="mb-6 ml-1 text-xl font-normal tracking-tight">API Keys</h1>
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