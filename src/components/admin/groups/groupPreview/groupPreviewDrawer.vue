<template>
  <a-drawer
    :visible="showGroupPreview"
    :selectedGroup="selectedGroup"
    width="40%"
    placement="right"
    :body-style="{ height: '100%' }"
    @close="handleClose"
  >
    <GroupPreview :selectedGroup="selectedGroup" />
  </a-drawer>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import GroupPreview from "./groupPreview.vue";

export default defineComponent({
  name: "GroupPreviewDrawer",
  components: {
    GroupPreview,
  },
  props: {
    showGroupPreview: {
      type: Boolean,
      default: false,
    },
    selectedGroup: {
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
  