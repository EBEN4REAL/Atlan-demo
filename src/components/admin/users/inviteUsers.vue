<template>
  <!-- <a-form :model="formModel" @submit="handleSubmit"> -->
  <div class="mb-3">Email addresses</div>
  <div v-for="(email, index) in emails" :key="index" class="flex items-center mb-3">
    <a-input v-model:value="email.value">
      <template #addonAfter>
        <a-select v-model:value="email.role" style="width: 150px">
          <a-select-option
            v-for="(role) in roleList"
            :key="role.id"
            :value="role.code"
          >{{ role.name }}</a-select-option>
        </a-select>
      </template>
    </a-input>
    <a-button v-if="emails.length > 1" class="ml-3" @click="deleteUserInput">
      <fa icon="fal times"></fa>
    </a-button>
  </div>
  <a-button type="link" class="px-0" @click="onAddNewUser">
    <fa icon="fal plus" class="mr-1"></fa>New user
  </a-button>
  <div class="flex justify-end mt-3">
    <div>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="isSubmitInvites"
        :loading="loading"
        @click="handleSubmit"
      >Invite Users</a-button>
    </div>
  </div>
  <!-- </a-form> -->
</template>
  <script lang="ts">
import { User } from "~/api/auth/user";
import { defineComponent, ref, computed, watch } from "vue";
import useRoles from "~/composables/roles/useRoles";
import { message } from "ant-design-vue";
export default defineComponent({
  name: "InviteUsersModal",
  setup(props, context) {
    const { roleList } = useRoles();

    const emails = ref([
      {
        value: "",
        role: "$member",
      },
    ]);
    const loading = ref(false);
    const isSubmitInvites = computed(() => {
      const reqIndex = emails.value.findIndex((email) => !email.value);
      return reqIndex !== -1;
    });
    const deleteUserInput = (index) => {
      emails.value.splice(index, 1);
      if (!emails.value.length) {
        emails.value = [
          {
            value: "",
            role: "$member",
          },
        ];
      }
    };
    const onAddNewUser = () => {
      emails.value = [
        ...emails.value,
        {
          value: "",
          role: "$member",
        },
      ];
    };
    const getRoleId = (email) => {
      console.log(email);
      const roleObj =
        roleList.value && roleList.value.length
          ? roleList.value.find((role) => role.code === email.role)
          : {};

      return roleObj.id || "";
    };
    const handleSubmit = async (event) => {
      event.preventDefault();
      const requestPayload = ref({
        users: emails.value.map((email) => ({
          email: email.value,
          roleName: email.role,
          roleId: getRoleId(email),
        })),
      });
      const { data, isReady, error, isLoading } =
        User.InviteUsers(requestPayload);
      watch(
        [data, isReady, error, isLoading],
        () => {
          loading.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            context.emit("handleInviteSent");
            message.success("Invites sent");
          } else if (error && error.value) {
            message.error("Failed to send invites, try again");
            context.emit("close");
          }
        },
        { immediate: true }
      );
    };
    return {
      roleList,
      emails,
      handleSubmit,
      onAddNewUser,
      deleteUserInput,
      isSubmitInvites,
      loading,
    };
  },
});
</script>
  