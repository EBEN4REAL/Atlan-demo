<template>
  <a-drawer
    :visible="showGroupPreview"
    :destroy-on-close="true"
    width="40%"
    placement="right"
    :body-style="{ height: '100%' }"
    @close="handleClose"
  >
    <GroupPreview
      :default-tab="defaultTab"
      :selected-group="selectedGroup"
      @refreshTable="$emit('refreshTable')"
    />
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
    defaultTab: {
      type: String,
      default: "members",
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
  