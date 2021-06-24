<template>
  <div>
    <UserList @updateSelectedUsers="updateSelectedUsers" />
    <div type="flex content-end">
      <div>
        <a-button
          class="mt-3"
          type="primary"
          size="large"
          :loading="addMemberLoading"
          :disabled="!selectedUserIds.length"
          @click="addMembersToGroup"
        >Add Members</a-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import UserList from "~/components/admin/groups/common/userList.vue";
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "AddGroupMembers",
  components: {
    UserList,
  },
  props: {
    addMemberLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const selectedUserIds = ref([]);
    const updateSelectedUsers = (userList) => {
      selectedUserIds.value = [...userList];
    };
    const addMembersToGroup = () => {
      context.emit("addMembersToGroup", selectedUserIds.value);
      selectedUserIds.value = [];
    };
    return {
      updateSelectedUsers,
      addMembersToGroup,
      selectedUserIds,
    };
  },
});
</script>
  