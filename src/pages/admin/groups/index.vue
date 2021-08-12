<template>
  <div class="bg-white">
    <p class="mb-2 text-2xl text-gray">Manage Groups</p>
    <div class="pb-6 text-sm text-gray">
      Add, remove and manage their members
    </div>
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
