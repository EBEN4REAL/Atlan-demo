<template>
  <div>
    <a-drawer
      :visible="showGroupPreview"
      :destroy-on-close="true"
      width="40%"
      placement="right"
      :body-style="{ height: '100%' }"
      @close="handleCloseGroupPreview"
    >
      <GroupPreview />
    </a-drawer>
    <a-drawer
      :visible="showUserPreview"
      :destroy-on-close="true"
      width="40%"
      placement="right"
      :body-style="{ height: '100%' }"
      @close="handleCloseUserPreview"
    >
      <UserPreview />
    </a-drawer>
  </div>
</template>
    
<script lang="ts">
import { defineComponent } from "vue";
import UserPreview from "@/admin/users/userPreview/userPreview.vue";
import GroupPreview from "@/admin/groups/groupPreview/groupPreview.vue";
import { useUserPreview } from "~/composables/user/showUserPreview";
import { useGroupPreview } from "~/composables/drawer/showGroupPreview";

export default defineComponent({
  name: "UserPreviewDrawer",
  components: {
    UserPreview,
    GroupPreview,
  },
  setup() {
    const { showPreview: showUserPreview, closePreview: closeUserPreview } =
      useUserPreview();
    const handleCloseUserPreview = () => {
      closeUserPreview();
    };
    const { showPreview: showGroupPreview, closePreview: closeGroupPreview } =
      useGroupPreview();
    const handleCloseGroupPreview = () => {
      closeGroupPreview();
    };

    return {
      showUserPreview,
      showGroupPreview,
      handleCloseUserPreview,
      handleCloseGroupPreview,
    };
  },
});
</script>
    