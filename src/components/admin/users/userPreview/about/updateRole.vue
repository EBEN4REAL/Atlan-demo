<template>
  <div class>
    <div>
      <div class="flex flex-row items-center cursor-pointer group">
        <p class="mb-0 text-gray-400">
          Role
          <fa icon="fal check" class="ml-1 text-success" v-if="updateSuccess"></fa>
        </p>
        <p
          v-if="!isUpdate && allowUpdate"
          class="mb-0 ml-2 text-xs leading-none transition duration-300 ease-in-out delay-100 opacity-0 text-primary group-hover:opacity-100"
          @click="onUpdate"
        >edit</p>
      </div>
      <div v-if="isUpdate" class="flex flex-col">
        <a-select v-model:value="roleLocal" class="min-w-full" :disabled="updateLoading">
          <a-select-option v-for="(role) in roles" :key="role.id" :value="role.id">{{ role.name }}</a-select-option>
        </a-select>
        <div class="flex items-center justify-between max-w-full mt-1">
          <div>
            <a-button
              type="primary"
              size="small"
              class="px-2 mr-1"
              :disabled="updateLoading"
              @click="handleUpdate"
            >update</a-button>
            <a-button type="link" size="small" class="p-0" @click="onCancel">cancel</a-button>
          </div>
          <div>
            <a-spin v-if="updateLoading" size="small" />
            <a-popover v-else-if="updateErrorMessage" placement="bottom">
              <template #content>{{ updateErrorMessage }}</template>
              <fa
                icon="fal exclamation-circle"
                class="text-red-600 cursor-pointer"
                v-if="updateErrorMessage"
              ></fa>
            </a-popover>
          </div>
        </div>
      </div>
      <div
        v-else
        class="text-gray"
      >{{ selectedUser.role_object.name?selectedUser.role_object.name:'-' }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import useRoles from "~/composables/roles/useRoles";
import { User } from "~/api/auth/user";
export default defineComponent({
  name: "UpdateRole",
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
    allowUpdate: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    let roles = ref([]);
    const { roleList } = useRoles();
    watch(roleList, () => {
      if (roleList && roleList.value) roles.value = roleList.value;
    });
    let isUpdate = ref(false);
    let roleLocal = ref(props.selectedUser.role_object.name);
    let updateErrorMessage = ref("");
    let updateSuccess = ref(false);
    let updateLoading = ref(false);
    const onUpdate = () => {
      roleLocal.value = props.selectedUser.role_object.name;
      updateErrorMessage.value = "";
      isUpdate.value = true;
    };
    const onCancel = () => {
      roleLocal.value = "";
      isUpdate.value = false;
    };
    const requestPayload = ref();
    const handleUpdate = () => {
      requestPayload.value = {
        roleId: roleLocal.value,
      };
      const { data, isReady, error, isLoading } = User.UpdateUserRole(
        props.selectedUser.id,
        requestPayload
      );
      watch(
        [data, isReady, error, isLoading],
        () => {
          updateLoading.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            // context.emit("updatedUser");
            updateSuccess.value = true;
            updateErrorMessage.value = "";
            isUpdate.value = false;
            setTimeout(() => {
              updateSuccess.value = false;
            }, 2000);
          } else if (error && error.value) {
            updateErrorMessage.value =
              "Unable to update role for the user. Please try again.";
          }
        },
        { immediate: true }
      );
    };
    return {
      roles,
      updateLoading,
      isUpdate,
      roleLocal,
      updateErrorMessage,
      updateSuccess,
      onUpdate,
      onCancel,
      handleUpdate,
    };
  },
});
</script>

<style></style>
