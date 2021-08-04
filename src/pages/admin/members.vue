<template>
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
