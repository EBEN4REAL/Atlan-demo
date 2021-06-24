<template>
  <div>
    <p
      class="mb-1"
    >{{ `Please select the role you want to assign to ${user.name||user.username||user.email}` }}</p>
    <a-select
      :loading="[STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)"
      v-model:value="selectedRole"
      class="min-w-full"
    >
      <a-select-option v-for="(role) in roleList" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
    </a-select>
    <div class="flex justify-end mt-3">
      <a-button type="primary" :loading="updateLoading" @click="handleRoleChange">Change role</a-button>
    </div>
  </div>
</template>
  <script lang="ts">
import { User } from "~/api/auth/user";
import { defineComponent, ref, computed } from "vue";
import useRoles from "~/composables/roles/useRoles";
import { message } from "ant-design-vue";
export default defineComponent({
  name: "ChangeRoleModal",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const selectedRole = ref("");
    const updateLoading = ref(false);
    const { roleList, getRolesList, state, STATES } = useRoles();

    const handleRoleChange = async () => {
      try {
        updateLoading.value = true;
        await User.UpdateUserRole(props.user.id, {
          roleId: selectedRole.value,
        });
        context.emit("updateRole");
        updateLoading.value = false;
      } catch (e) {
        updateLoading.value = false;
        message.error("Unable to update role for the user. Please try again.");
      }
    };
    return {
      roleList,
      selectedRole,
      handleRoleChange,
      updateLoading,
      state,
      STATES,
      getRolesList,
    };
  },
});
</script>
  