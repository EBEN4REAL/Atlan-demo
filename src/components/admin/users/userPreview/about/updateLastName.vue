<template>
  <div class>
    <div>
      <div class="flex flex-row items-center cursor-pointer group">
        <p class="mb-0 text-xs text-gray-500">
          Last Name
          <span v-if="updateSuccess" class="ml-1">
            <i class="text-green-600 far fa-check" />
          </span>
        </p>
        <p
          v-if="!isUpdate && allowUpdate"
          class="mb-0 ml-2 text-xs leading-none transition duration-300 ease-in-out delay-100 opacity-0 text-primary-500 group-hover:opacity-100"
          @click="onUpdate"
        >edit</p>
      </div>
      <div v-if="isUpdate" class="flex flex-col">
        <a-textarea
          v-model:value="lastNameLocal"
          placeholder="Last Name"
          :disabled="updateLoading"
          :auto-size="{ minRows: 1, maxRows: 3 }"
        />
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
            <a-popover v-else-if="updateErrorMessage || updateSuccess" placement="bottom">
              <template #content>{{ updateErrorMessage }}</template>
              <i
                class
                :class="{
                  'far fa-warning text-red-600 cursor-pointer': updateErrorMessage,
                  'far fa-check text-green-600': updateSuccess,
                }"
              />
            </a-popover>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500 capitalize">{{ selectedUser.last_name }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { User } from "~/api/auth/user";
import { message } from "ant-design-vue";
import axios, { CancelTokenSource } from "axios";
export default defineComponent({
  name: "UpdateLastName",
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
    let isUpdate = ref(false);
    let lastNameLocal = ref("");
    let updateErrorMessage = ref("");
    let updateSuccess = ref(false);
    let updateLoading = ref(false);
    const onUpdate = () => {
      isUpdate.value = true;
    };
    const onCancel = () => {
      lastNameLocal.value = "";
      isUpdate.value = false;
    };
    const requestPayload = ref();
    const handleUpdate = () => {
      requestPayload.value = {
        firstName: props.selectedUser.first_name,
        lastName: lastNameLocal.value,
        attributes: {
          designation: [props.selectedUser.attributes.designation],
          mobile_number: [props.selectedUser.attributes.mobile_number],
        },
      };
      const { data, isLoading, error } = User.UpdateUserV2(
        props.selectedUser.id,
        requestPayload.value
      );
      watch([data, isLoading, error], () => {
        updateLoading = isLoading;
        if (data) {
          context.emit("updatedUser");
          updateSuccess.value = true;
          updateErrorMessage.value = "";
          isUpdate.value = false;
          setTimeout(() => {
            updateSuccess.value = false;
          }, 1000);
        } else {
          updateErrorMessage.value =
            "Unable to update last name, please try again.";
        }
      });
    };
    return {
      updateLoading,
      isUpdate,
      lastNameLocal,
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
