<template>
  <div>
    <a-form layout="vertical" @submit="handleSubmit">
      <div class="flex content-between">
        <div>
          <a-form-item label="Group Name">
            <a-input
              v-model:value="group.name"
              v-decorator="['name', { rules: [{ required: true }] }]"
              @input="setGroupAlias"
            />
          </a-form-item>
        </div>
        <div>
          <a-form-item label="Group Alias">
            <a-input
              v-model:value="group.alias"
              v-decorator="['alias', { rules: [{ required: true }] }]"
              @input="restrictGroupAlias"
            />
          </a-form-item>
        </div>
      </div>
      <a-form-item label="Group Description">
        <a-textarea v-model:value="group.description" v-decorator="['description']" :rows="3" />
      </a-form-item>
      <UserList @updateSelectedUsers="updateUserList" />
      <div class="flex content-end">
        <div>
          <a-button
            type="primary"
            size="large"
            html-type="submit"
            :disabled="isSubmitDisabled"
          >Create Group</a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>
<script lang="ts">
import { Group } from "~/api/auth/group";
import UserList from "~/components/admin/groups/common/userList.vue";
import { defineComponent, ref, reactive, computed } from "vue";
import whoami from "~/composables/user/whoami";
import { message } from "ant-design-vue";
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
    const group = reactive({ name: "", description: "", alias: "" });
    // const userIds = ref([]);
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
      // userIds.value = list;
    };
    const handleSubmit = async (event) => {
      event.preventDefault();
      try {
        const { username } = whoami();
        const currentDate = new Date().toISOString();
        const createdById = username;
        // deliberately switching alias and name so as to keep alias as a unique identifier for the group, for keycloak name is the unique identifier. For us, alias is the unique identifier and different groups with same name can exist.
        const params = {
          group: {
            name: group.alias,
            attributes: {
              description: [group.description],
              alias: [group.name],
              created_at: [currentDate],
              created_by: [createdById],
              image: [""],
            },
          },
          users: userIds.value,
        };
        await Group.CreateGroup(params);
        message.success("Group added");
        context.emit("createGroup");
      } catch (error) {
        message.error("Unable to create group, please try again.");
      }
    };
    return {
      group,
      isSubmitDisabled,
      handleSubmit,
      setGroupAlias,
      restrictGroupAlias,
      updateUserList,
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

