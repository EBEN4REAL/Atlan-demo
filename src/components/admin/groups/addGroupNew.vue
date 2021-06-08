<template>
  <!-- <a-form @submit="handleSubmit">
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
      <a-textarea
        v-model="group.description"
        v-decorator="['description']"
        :rows="3"
      />
    </a-form-item>
    <UserList @updateSelectedUsers="updateUserList" /> 
    <a-row type="flex" justify="end">
      <a-col>
        <a-button
          type="primary"
          size="large"
          html-type="submit"
          :disabled="isSubmitDisabled"
        >
          Create Group
        </a-button>
      </a-col>
    </a-row>
  </a-form> -->
  <p>Popup</p>
</template>
<script>
export default {
  name: "AddGroup",
  setup() {},
};
</script>
<style>
.addGroupModal {
  .ant-modal {
    top: 70px !important;
  }
}
</style>