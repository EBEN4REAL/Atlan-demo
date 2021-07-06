<template>
  <div class>
    <div>
      <div class="flex flex-row items-center cursor-pointer group">
        <p class="mb-0 text-xs text-gray-500">
          Mobile Number
          <fa icon="fal check" class="ml-1 text-green-600 cursor-pointer" v-if="updateSuccess"></fa>
        </p>
        <p
          v-if="!isUpdate && allowUpdate"
          class="mb-0 ml-2 text-xs leading-none transition duration-300 ease-in-out delay-100 opacity-0 text-primary-500 group-hover:opacity-100"
          @click="onUpdate"
        >edit</p>
      </div>
      <div v-if="isUpdate" class="flex flex-col">
        <div class="tel-input-custom">
          <!-- v-model on vue-3-tel-input does not work, we need to handle the 2 way binding by listening to input event manually-->
          <!-- more context: https://stackoverflow.com/questions/67806831/using-vue3-tel-input-why-v-model-directive-doesnt-work-->

          <vue-tel-input
            id="tel-input-custom"
            :value="mobileNumberLocal"
            valid-characters-only
            mode="international"
            validate
            @input="onInput"
            :inputOptions="{ showDialCode: true }"
          />
        </div>
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
              <fa
                icon="fal exclamation-circle"
                class="text-red-600 cursor-pointer"
                v-if="updateErrorMessage"
              ></fa>
            </a-popover>
          </div>
        </div>
      </div>
      <div v-else class="text-gray-500">{{ selectedUser.attributes.mobile_number[0] || '-' }}</div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { VueTelInput } from "vue3-tel-input";
import "vue3-tel-input/dist/vue3-tel-input.css";
import { defineComponent, ref, watch } from "vue";
import { User } from "~/api/auth/user";
export default defineComponent({
  name: "UpdateMobileNumber",
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
  components: {
    VueTelInput,
  },
  setup(props, context) {
    let isUpdate = ref(false);
    let mobileNumberLocal = ref(
      props?.selectedUser?.attributes?.mobile_number?.[0] ?? ""
    );
    let updateErrorMessage = ref("");
    let updateSuccess = ref(false);
    let updateLoading = ref(false);
    const onUpdate = () => {
      isUpdate.value = true;
    };
    const onInput = (phone, phoneObject) => {
      if (phone && phoneObject?.formatted) {
        mobileNumberLocal.value = phoneObject.formatted;
      } else if (!phone) mobileNumberLocal.value = "";
    };
    const onCancel = () => {
      mobileNumberLocal.value = "";
      isUpdate.value = false;
    };
    const requestPayload = ref();
    const handleUpdate = () => {
      requestPayload.value = {
        attributes: {
          mobile_number: [mobileNumberLocal.value],
        },
      };
      updateLoading.value = true;
      const { data, isReady, error } = User.UpdateUser(
        props.selectedUser.id,
        requestPayload
      );
      watch([data, isReady, error], () => {
        if (isReady && !error.value) {
          context.emit("updatedUser");
          updateLoading.value = false;
          updateSuccess.value = true;
          updateErrorMessage.value = "";
          isUpdate.value = false;
          setTimeout(() => {
            updateSuccess.value = false;
          }, 1000);
        } else {
          updateErrorMessage.value =
            "Unable to update mobile number, please try again.";
          updateLoading.value = false;
        }
      });
    };
    return {
      updateLoading,
      isUpdate,
      mobileNumberLocal,
      updateErrorMessage,
      updateSuccess,
      onUpdate,
      onCancel,
      handleUpdate,
      onInput,
    };
  },
});
</script>

<style lang="less">
#tel-input-custom {
  border: 1px solid #d9d9d9;
  &:focus,
  &:active,
  &:focus-within {
    border-color: #4876d9;
    border-right-width: 1px !important;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(34, 81, 204, 0.2);
  }
  .vti__dropdown {
    outline: none !important;
  }
}
</style>
