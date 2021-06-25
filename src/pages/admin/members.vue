<template>
  <Users></Users>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Users from "@/admin/users/index.vue";
export default defineComponent({
  components: {
    Users,
  },
});
</script>
<style lang="less" module>
</style>
<route lang="yaml">
    meta:
    layout: default
    requiresAuth: true
    </route>