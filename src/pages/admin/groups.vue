<template>
  <div>
    <p class="mb-2 text-xl font-normal tracking-tight">Manage Groups</p>
    <GroupList></GroupList>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useHead } from "@vueuse/head";
import GroupList from "@/admin/groups/index.vue";
export default defineComponent({
  components: {
    GroupList,
  },
  setup() {
    useHead({
      title: "Groups",
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
