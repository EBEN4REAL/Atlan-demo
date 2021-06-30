<template>
  <div>
    <UpdateName :group="selectedGroup" @refreshTable="$emit('refreshTable')" class="mt-3" />
    <UpdateAlias :group="selectedGroup" @refreshTable="$emit('refreshTable')" class="mt-3" />
    <UpdateDescription :group="selectedGroup" @refreshTable="$emit('refreshTable')" class="mt-3" />
    <div class="mt-3">
      <div class="flex items-center">
        <p class="mb-0 text-xs text-gray-500">Members</p>
      </div>
      <div class="text-gray-500 capitalize">{{ selectedGroup.memberCount }}</div>
    </div>
    <div class="mt-3">
      <div class="flex items-center">
        <p class="mb-0 text-xs text-gray-500">Created By</p>
      </div>
      <div class="text-gray-500">{{ selectedGroup.createdBy }}</div>
    </div>
    <div class="mt-3">
      <div class="flex items-center">
        <p class="mb-0 text-xs text-gray-500">Created</p>
      </div>
      <div class="text-gray-500 capitalize">{{ selectedGroup.createdAtTimeAgo }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UpdateName from "~/components/admin/groups/groupPreview/about/updateName.vue";
import UpdateAlias from "~/components/admin/groups/groupPreview/about/updateAlias.vue";
import UpdateDescription from "~/components/admin/groups/groupPreview/about/updateDescription.vue";
export default defineComponent({
  name: "About",
  props: {
    selectedGroup: {
      type: Object,
      default: {},
    },
  },
  components: {
    UpdateName,
    UpdateAlias,
    UpdateDescription,
  },
});
</script>
  
  <style></style>
  