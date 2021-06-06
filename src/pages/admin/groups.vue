<template>
  <div>
    <p class="mb-2 text-xl font-normal tracking-tight">Manage Groups</p>
  </div>
  <GroupList></GroupList>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GroupList from "@/admin/groups/index.vue";
export default defineComponent({
  components: {
    GroupList,
  },
});
</script>
<style lang="less" module>
</style>