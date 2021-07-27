<template>
  <div class="tab-content-wrapper">
    <div class="flex">
      <UpdateName
        :group="selectedGroup"
        @refreshTable="$emit('refreshTable')"
        class="flex-1 mr-4"
      />
      <UpdateAlias
        :group="selectedGroup"
        @refreshTable="$emit('refreshTable')"
        class="flex-1"
      />
    </div>
    <div class="flex mt-3">
      <UpdateDescription
        :group="selectedGroup"
        @refreshTable="$emit('refreshTable')"
        class="flex-1 mr-4"
      />
      <div class="flex-1">
        <div class="flex items-center">
          <p class="mb-0 text-gray-400">Members</p>
        </div>
        <div class="text-gray">
          {{ selectedGroup.memberCount }}
        </div>
      </div>
    </div>
    <div class="flex mt-3">
      <div class="flex-1 mr-4">
        <div class="flex items-center">
          <p class="mb-0 text-gray-400">Created By</p>
        </div>
        <div class="text-gray">{{ selectedGroup.createdBy }}</div>
      </div>
      <div class="flex-1">
        <div class="flex items-center">
          <p class="mb-0 text-gray-400">Created</p>
        </div>
        <div class="capitalize text-gray">
          {{ selectedGroup.createdAtTimeAgo }}
        </div>
      </div>
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
  
<style lang="less" scoped>
.tab-content-wrapper {
  min-height: calc(100vh - 10rem) !important;
}
</style>
  