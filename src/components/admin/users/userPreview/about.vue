<template>
  <div class="tab-content-wrapper">
    <UpdateFirstName
      :selectedUser="selectedUser"
      :allowUpdate="isCurrentUser"
      @updatedUser="$emit('updatedUser')"
      class="mt-3"
    />
    <UpdateLastName
      :selectedUser="selectedUser"
      :allowUpdate="isCurrentUser"
      @updatedUser="$emit('updatedUser')"
      class="mt-3"
    />
    <p class="mt-3 mb-0 text-xs text-gray-500">Display Name</p>
    <div class="text-gray-500">@{{ selectedUser.username }}</div>
    <p class="mt-3 mb-0 text-xs text-gray-500">Email</p>
    <div class="text-gray-500">{{ selectedUser.email }}</div>
    <UpdateMobileNumber
      :selectedUser="selectedUser"
      :allowUpdate="isCurrentUser"
      @updatedUser="$emit('updatedUser')"
      class="mt-3"
    />
    <UpdateDesignation
      class="mt-3"
      @updatedUser="$emit('updatedUser')"
      :user="selectedUser"
      :allowUpdate="isCurrentUser"
    />
    <UpdateSkills
      class="mt-3"
      @updatedUser="$emit('updatedUser')"
      :user="selectedUser"
      :allowUpdate="isCurrentUser"
    />
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
export default defineComponent({
  name: "UserPreviewAboutComponent",
  components: {
    Tags,
    UpdateFirstName,
    UpdateLastName,
    UpdateMobileNumber,
    UpdateSkills,
    UpdateDesignation,
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
  