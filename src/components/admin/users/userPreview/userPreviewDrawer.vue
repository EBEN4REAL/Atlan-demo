<template>
  <a-drawer
    :visible="showUserPreview"
    :selectedUser="selectedUser"
    :destroyOnClose="true"
    width="40%"
    placement="right"
    :body-style="{ height: '100%' }"
    @close="handleClose"
  >
    <UserPreview :selectedUser="selectedUser" @reloadTable="$emit('reloadTable')" />
  </a-drawer>
</template>
    
<script lang="ts">
import { defineComponent } from "vue";
import UserPreview from "./userPreview.vue";

export default defineComponent({
  name: "UserPreviewDrawer",
  components: {
    UserPreview,
  },
  props: {
    showUserPreview: {
      type: Boolean,
      default: false,
    },
    selectedUser: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    const handleClose = () => {
      context.emit("closePreview");
    };
    return { handleClose };
  },
});
</script>
    