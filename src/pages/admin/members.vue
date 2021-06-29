<template>
  <div>
    <p class="mb-2 text-xl font-normal tracking-tight">
      Manage Members
      <span
        class="inline-flex items-center justify-center px-2 py-1 ml-2 mr-2 text-xs font-bold leading-none text-red-100 bg-indigo-600 rounded-full "
        >9</span
      >
    </p>
  </div>
  <Users></Users>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Users from "@/admin/users/index.vue";
import { useHead } from "@vueuse/head";
export default defineComponent({
  components: {
    Users,
  },
  setup() {
    useHead({
      title: "Members",
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
