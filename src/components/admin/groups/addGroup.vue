<template>
  <div>
    <a-form :model="group" :rules="validations" layout="vertical" @submit="handleSubmit">
      <div class="flex justify-between">
        <div class="w-1/2">
          <a-form-item label="Group Name" name="name">
            <a-input v-model:value="group.name" @input="setGroupAlias" />
          </a-form-item>
        </div>
        <div>
          <a-form-item label="Group Alias" name="alias">
            <a-input v-model:value="group.alias" @input="restrictGroupAlias" />
          </a-form-item>
        </div>
      </div>
      <a-form-item label="Group Description" name="description">
        <a-textarea v-model:value="group.description" :rows="3" />
      </a-form-item>
      <a-checkbox class="flex items-center mb-2" v-model:checked="isDefault">
        <div class="flex items-center">
          <div class="mr-2">Mark as default</div>
          <a-tooltip>
            <template #title>New users will be automatically added to default groups</template>
            <fa icon="fal info-circle" class="text-xs" />
          </a-tooltip>
        </div>
      </a-checkbox>
      <UserList class="max-h-48" @updateSelectedUsers="updateUserList" />
      <div class="flex justify-end mt-6">
        <div>
          <a-button
            type="primary"
            size="large"
            html-type="submit"
            :disabled="isSubmitDisabled"
            :loading="createGroupLoading"
          >Create Group</a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>
<script lang="ts">
import { Group } from "~/api/auth/group";
import UserList from "~/components/admin/groups/common/userList.vue";
import { defineComponent, ref, reactive, computed, UnwrapRef } from "vue";
import whoami from "~/composables/user/whoami";
import { message } from "ant-design-vue";

interface Group {
  name: String;
  alias: String;
  description: String;
}
export default defineComponent({
  name: "AddGroup",
  data() {
    return {
      group: {
        name: "",
        alias: "",
        description: "",
      },
    };
  },
  components: { UserList },
  setup(props, context) {
    const createGroupLoading = ref(false);
    const isDefault = ref(false);
    const group: UnwrapRef<Group> = reactive({
      name: "",
      description: "",
      alias: "",
    });
    const validations = {
      name: [
        { required: true, message: "Group name is required", trigger: "blur" },
      ],
    };
    const { username } = whoami();
    const userIds = ref([]);
    const isSubmitDisabled = computed(() => {
      const { name, alias } = group;
      return name == "" || alias == "" ? true : false;
    });
    const setGroupAlias = () => {
      group.alias = getAliasFromName(group.name);
    };
    const getAliasFromName = (title) => {
      return title
        .trim()
        .toLowerCase()
        .replace(/[!:;@#$%^&*'"<>,/.\\(){}[\]|`~?+=-]+/g, "")
        .replace(/[ ]+/g, "_");
    };
    const restrictGroupAlias = () => {
      group.alias = getAliasFromName(group.alias);
    };
    const updateUserList = (list) => {
      userIds.value = list;
    };
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        createGroupLoading.value = true;
        const currentDate = new Date().toISOString();
        const createdBy = username.value;
        // deliberately switching alias and name so as to keep alias as a unique identifier for the group, for keycloak name is the unique identifier. For us, alias is the unique identifier and different groups with same name can exist.
        const params = {
          group: {
            name: group.alias,
            attributes: {
              description: [group.description],
              alias: [group.name],
              created_at: [currentDate],
              created_by: [createdBy],
              is_default: [isDefault],
            },
          },
          users: userIds.value,
        };
        await Group.CreateGroup(params);
        message.success("Group added");
        context.emit("createGroup");
        createGroupLoading.value = false;
      } catch (error) {
        createGroupLoading.value = false;
        message.error("Unable to create group, please try again.");
      }
    };
    return {
      group,
      isSubmitDisabled,
      validations,
      createGroupLoading,
      handleSubmit,
      setGroupAlias,
      restrictGroupAlias,
      updateUserList,
      isDefault,
    };
  },
});
</script>
<style lang="less">
.addGroupModal {
  .ant-modal {
    top: 70px !important;
  }
}
</style>

