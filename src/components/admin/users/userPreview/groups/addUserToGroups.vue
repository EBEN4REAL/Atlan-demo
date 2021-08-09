<template>
  <div>
    <GroupList @updateSelectedGroups="updateSelectedGroups" />
    <div type="flex content-end">
      <div>
        <a-button
          type="primary"
          size="large"
          :loading="addToGroupLoading"
          :disabled="!selectedGroupIds.length"
          @click="addUserToGroups"
        >Add to groups</a-button>
      </div>
    </div>
  </div>
</template>
  <script lang="ts">
import { defineComponent, ref } from "vue";
import GroupList from "./groupList.vue";

export default defineComponent({
  name: "AddGroupMembers",
  components: {
    GroupList,
  },
  props: {
    addToGroupLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const selectedGroupIds = ref([]);
    const updateSelectedGroups = (groupList) => {
      selectedGroupIds.value = [...groupList];
    };
    const addUserToGroups = () => {
      context.emit("addUserToGroups", selectedGroupIds.value);
      selectedGroupIds.value = [];
    };
    return {
      updateSelectedGroups,
      addUserToGroups,
      selectedGroupIds,
    };
  },
});
</script>
    