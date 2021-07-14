<template>
  <div class="tab-content-wrapper">
    <div class="flex">
      <UpdateFirstName
        :selectedUser="selectedUser"
        :allowUpdate="isCurrentUser"
        @updatedUser="$emit('updatedUser')"
        class="flex-1 mr-4"
      />
      <UpdateLastName
        :selectedUser="selectedUser"
        :allowUpdate="isCurrentUser"
        @updatedUser="$emit('updatedUser')"
        class="flex-1"
      />
    </div>
    <div class="flex mt-3">
      <div class="flex-1 mr-4">
        <p class="mb-0 text-gray-400">Display Name</p>
        <div class="text-gray">@{{ selectedUser.username }}</div>
      </div>
      <UpdateRole
        :selectedUser="selectedUser"
        :allowUpdate="isCurrentUser"
        @updatedUser="$emit('updatedUser')"
        class="flex-1"
      />
    </div>
    <div class="flex mt-3">
      <div class="flex-1 mr-4">
        <p class="mb-0 text-xs text-gray-400">Email</p>
        <div class="text-gray">{{ selectedUser.email }}</div>
      </div>
      <UpdateMobileNumber
        :selectedUser="selectedUser"
        :allowUpdate="isCurrentUser"
        @updatedUser="$emit('updatedUser')"
        class="flex-1"
      />
    </div>
    <div class="flex mt-3">
      <UpdateSkills
        class="flex-1 mr-4"
        @updatedUser="$emit('updatedUser')"
        :user="selectedUser"
        :allowUpdate="isCurrentUser"
      />
      <UpdateDesignation
        class="flex-1"
        @updatedUser="$emit('updatedUser')"
        :user="selectedUser"
        :allowUpdate="isCurrentUser"
      />
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import Tags from "@common/badge/tags/index.vue";
import UpdateFirstName from "~/components/admin/users/userPreview/about/updateFirstName.vue";
import UpdateLastName from "~/components/admin/users/userPreview/about/updateLastName.vue";
import UpdateMobileNumber from "~/components/admin/users/userPreview/about/updateMobileNumber.vue";
import UpdateSkills from "~/components/admin/users/userPreview/about/updateSkills.vue";
import UpdateDesignation from "~/components/admin/users/userPreview/about/updateDesignation.vue";
import UpdateRole from "~/components/admin/users/userPreview/about/updateRole.vue";
export default defineComponent({
  name: "UserPreviewAboutComponent",
  components: {
    Tags,
    UpdateFirstName,
    UpdateLastName,
    UpdateMobileNumber,
    UpdateSkills,
    UpdateDesignation,
    UpdateRole,
  },
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
    isCurrentUser: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
  <style lang="less" scoped>
.tab-content-wrapper {
  min-height: calc(100vh - 10rem) !important;
}
</style>
  