<template>
  <a-form @submit="handleSubmit">
    <a-row type="flex" justify="space-between">
      <a-col :span="11">
        <a-form-item label="Group Name">
          <a-input
            v-model="group.name"
            v-decorator="['name', { rules: [{ required: true }] }]"
            @input="setGroupAlias"
          />
        </a-form-item>
      </a-col>
      <a-col :span="11">
        <a-form-item label="Group Alias">
          <a-input
            v-model="group.alias"
            v-decorator="['alias', { rules: [{ required: true }] }]"
            @input="restrictGroupAlias"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item label="Group Description">
      <a-textarea v-model="group.description" v-decorator="['description']" :rows="3" />
    </a-form-item>
    <UserList @updateSelectedUsers="updateUserList" />
    <a-row type="flex" justify="end">
      <a-col>
        <a-button
          type="primary"
          size="large"
          html-type="submit"
          :disabled="isSubmitDisabled"
        >Create Group</a-button>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { Group as GroupService } from "~/services/auth";
import UserList from "~/components/admin/groups/common/userList.vue";
import { FETCH_GROUP_LIST } from "~/constant/store_types/groups.js";
export default {
  name: "AddGroup",
  components: { UserList },
  data() {
    return {
      group: {
        name: "",
        description: "",
        alias: "",
      },
      userIds: [],
    };
  },
  computed: {
    ...mapState({
      userName: (state) => state.username,
    }),
    isSubmitDisabled() {
      const { name, alias } = this.group;
      return name == "" || alias == "" ? true : false;
    },
  },
  methods: {
    ...mapActions([FETCH_GROUP_LIST]),
    async handleSubmit(event) {
      event.preventDefault();
      try {
        const currentDate = new Date().toISOString();
        const createdById = this.userName;
        // deliberately switching alias and name so as to keep alias as a unique identifier for the group, for keycloak name is the unique identifier. For us, alias is the unique identifier and different groups with same name can exist.
        const params = {
          group: {
            name: this.group.alias,
            attributes: {
              description: [this.group.description],
              alias: [this.group.name],
              created_at: [currentDate],
              created_by: [createdById],
              image: [""],
            },
          },
          users: this.userIds,
        };
        await GroupService.createGroup(this.$axios, params);
        await this.FETCH_GROUP_LIST();
        this.$message.success("Group added");
        this.group = {};
        this.$emit("closeModal");
      } catch (error) {
        this.$message.error("Unable to create group, please try again.");
      }
    },
    setGroupAlias() {
      this.group.alias = this.getAliasFromName(this.group.name);
    },
    getAliasFromName(title) {
      return title
        .trim()
        .toLowerCase()
        .replace(/[!:;@#$%^&*'"<>,/.\\(){}[\]|`~?+=-]+/g, "")
        .replace(/[ ]+/g, "_");
    },
    restrictGroupAlias() {
      this.group.alias = this.getAliasFromName(this.group.alias);
    },
    updateUserList(list) {
      this.userIds = list;
    },
  },
};
</script>
<style lang="scss">
.addGroupModal {
  .ant-modal {
    top: 70px !important;
  }
}
</style>

