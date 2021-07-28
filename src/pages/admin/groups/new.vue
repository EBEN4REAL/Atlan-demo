<template>
  <div class="flex pb-3 mb-3 text-2xl border-b text-gray">
    <div class="flex mr-3 cursor-pointer" @click="routeToGroups">
      <fa icon="fal chevron-left" />
    </div>
    <div>Create Group</div>
  </div>
  <AddGroup class="mt-6" />
</template>

<script>
import { useRouter } from "vue-router";
import AddGroup from "@/admin/groups/addGroup.vue";

export default {
  name: "NewGroup",
  components: {
    AddGroup,
  },
  setup() {
    const router = useRouter();
    const routeToGroups = () => {
      router.push(`/admin/groups`);
    };
    return { routeToGroups };
  },
};
</script>
<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
<style>
</style>