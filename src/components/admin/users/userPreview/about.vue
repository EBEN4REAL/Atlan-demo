<template>
  <div class="tab-content-wrapper">
    <div class="grid w-full grid-cols-2 gap-4 mb-4">
      <div name="firstName" class>
        <label>First Name</label>
        <a-input v-model:value.trim="localUserInfo.firstName" placeholder="First Name" />
      </div>
      <div class>
        <label>Last Name</label>
        <a-input v-model:value.trim="localUserInfo.lastName" placeholder="Last Name" />
      </div>
    </div>
    <div class="grid w-full grid-cols-2 gap-4 mb-4">
      <div class>
        <label>Display Name</label>
        <a-input
          v-model:value.trim="localUserInfo.username"
          placeholder="Display Name"
          :disabled="true"
        />
      </div>

      <div class>
        <label>Designation</label>
        <a-input v-model:value.trim="localUserInfo.designation" placeholder="Designation" />
      </div>
    </div>
    <div class="w-full mb-4">
      <label>Email</label>
      <a-input v-model:value.trim="localUserInfo.email" placeholder="Email" :disabled="true" />
    </div>
    <div class="w-full mb-4 tel-input-custom">
      <label>Mobile Number</label>
      <vue-tel-input
        id="tel-input-custom"
        v-model="test"
        valid-characters-only
        disabled-formatting
        mode="international"
        validate
        class="ant-input"
      />
    </div>
    <a-button
      type="primary"
      size="large"
      :disabled="!localChangesPresent || updateLoading || !localUserInfo.firstName"
      @click="handleProfileUpdate"
      :loading="updateLoading"
    >Update Profile</a-button>
  </div>
</template>
  
  <script lang="ts">
// @ts-ignore
import { VueTelInput } from "vue3-tel-input";
import "vue3-tel-input/dist/vue3-tel-input.css";
import { defineComponent, computed, reactive, ref } from "vue";
import { User } from "~/api/auth/user";
import { message } from "ant-design-vue";
import Tags from "@common/badge/tags/index.vue";
export default defineComponent({
  name: "UserPreviewAboutComponent",
  components: { VueTelInput, Tags },
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
  },
  setup(props, context) {
    const test = ref(null);
    const updateLoading = ref(false);
    const savedUserInfo = computed(() => {
      return {
        firstName: props.selectedUser?.first_name ?? "",
        lastName: props.selectedUser?.last_name ?? "",
        designation: props.selectedUser?.attributes?.designation ?? "",
        mobileNumber: props.selectedUser?.attributes?.mobile_number ?? "",
        username: props.selectedUser?.username ?? "",
        email: props.selectedUser?.email ?? "",
      };
    });
    const localUserInfo = reactive({ ...savedUserInfo.value });
    const localChangesPresent = computed(() => {
      return !compareObjects(localUserInfo, savedUserInfo.value);
    });
    // localUserInfo = Object.assign({}, savedUserInfo.value);
    const compareObjects = (source: any, obj: any) => {
        return Object.keys(source).every(
          // eslint-disable-next-line no-prototype-builtins
          (key) => obj.hasOwnProperty(key) && obj[key] === source[key]
        );
      },
      handleProfileUpdate = async (event: any) => {
        updateLoading.value = true;
        event.preventDefault();
        const requestPayload = {
          firstName: localUserInfo.firstName,
          lastName: localUserInfo.lastName,
          attributes: {
            designation: [localUserInfo.designation],
            mobile_number: [localUserInfo.mobileNumber],
          },
        };
        try {
          await User.UpdateUser(props.selectedUser.id, requestPayload);
          context.emit("reloadTable");
          message.success("User profile updated.");
          updateLoading.value = false;
        } catch (error) {
          updateLoading.value = false;
          message.error("Unable to update user profile, please try again.");
        }
      };
    return {
      handleProfileUpdate,
      localChangesPresent,
      localUserInfo,
      updateLoading,
      test,
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
  <style lang="less" scoped>
.tab-content-wrapper {
  min-height: calc(100vh - 10rem) !important;
}
</style>
  