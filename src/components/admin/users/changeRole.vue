<template>
  <div>
    <p
      class="mb-1"
    >{{ `Please select the role you want to assign to ${user.name||user.username||user.email}` }}</p>
    <a-select v-model:value="selectedRole" class="min-w-full">
      <a-select-option v-for="(role) in roles" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
    </a-select>
    <div class="flex justify-end mt-3">
      <a-button type="primary" :loading="updateLoading" @click="handleRoleChange">Change role</a-button>
    </div>
  </div>
</template>
  <script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { message } from "ant-design-vue";
import { User } from "~/api/auth/user";
import useRoles from "~/composables/roles/useRoles";

export default defineComponent({
  name: "ChangeRoleModal",
  props: {
    user: {
      type: Object,
      required: true,
    },
    roleList: {
      type: Array,
      default: [],
    },
  },
  setup(props, context) {
    const selectedRole = ref("");
    const updateLoading = ref(false);
    const roles = ref([]);
    if (!props.roleList || !props.roleList.length) {
      const { roleList } = useRoles();
      watch(roleList, () => {
        if (roleList && roleList.value) roles.value = roleList.value;
      });
    } else roles.value = props.roleList;

    const handleRoleChange = () => {
      const requestPayload = ref({
        roleId: selectedRole.value,
      });
      const { data, isReady, error, isLoading } = User.UpdateUserRole(
        props.user.id,
        requestPayload
      );
      watch(
        [data, isReady, error, isLoading],
        () => {
          updateLoading.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            context.emit("updateRole");
          } else if (error && error.value) {
            message.error(
              "Unable to update role for the user. Please try again."
            );
          }
        },
        { immediate: true }
      );
    };
    return {
      roles,
      selectedRole,
      handleRoleChange,
      updateLoading,
    };
  },
});
</script>
  