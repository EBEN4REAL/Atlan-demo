<template>
  <div>
    <div>
      <p class="mb-2 text-xl font-normal tracking-tight">
        Manage Members
        <span
          class="inline-flex items-center justify-center px-2 py-1 ml-2 mr-2 text-xs font-bold leading-none text-red-100 bg-indigo-600 rounded-full"
        >{{filteredUserCount}}</span>
      </p>
    </div>
    <div class="flex justify-between my-3 gap-x-5">
      <a-input-search
        placeholder="Search Members"
        class="mr-1"
        size="default"
        v-model:value="searchText"
        @change="handleSearch"
        :allowClear="true"
      ></a-input-search>

      <div class="flex justify-end">
        <a-popover placement="bottom">
          <template #content>
            <div class="flex">
              <div class="pr-3 border-r border-gray-200 border-dashed">
                <div class="flex justify-between">
                  <p class="mb-1 text-gray-500">Status</p>
                  <fa
                    icon="fal times-circle"
                    class="text-red-600 cursor-pointer"
                    @click="resetStatusFilter"
                    v-if="statusFilterValue"
                  ></fa>
                </div>
                <a-radio-group v-model:value="statusFilterValue" @change="handleStatusFilterChange">
                  <div class="flex flex-col space-y-1">
                    <a-radio :value="'enabled'">Active Users</a-radio>
                    <a-radio :value="'disabled'">Disabled Users</a-radio>
                  </div>
                </a-radio-group>
              </div>
              <div class="pl-3">
                <p class="mb-1 text-gray-500">Role</p>
                <a-radio-group>
                  <div class="flex flex-col space-y-1">
                    <a-radio>Admin</a-radio>
                    <a-radio>Cloud</a-radio>
                    <a-radio>Steward</a-radio>
                    <a-radio>Member</a-radio>
                  </div>
                </a-radio-group>
              </div>
            </div>
          </template>
          <a-button size="default">
            <fa icon="fal filter" class="mr-1"></fa>
            <!--TODO: add logic to count filters and show the count here-->
            <span v-if="statusFilterValue">(1)</span>
          </a-button>
        </a-popover>
        <a-button
          v-if="loginWithEmailAllowed"
          type="primary"
          class="ml-4"
          size="default"
          @click="handleInviteUsers"
        >Add User</a-button>
      </div>
    </div>
    <!-- Table for users-->
    <div>
      <div v-if="listType==='users'">
        <a-table
          v-if="userList && listType === 'users'"
          :dataSource="userList"
          :columns="columns"
          :rowKey="(user) => user.id"
          @change="handleTableChange"
          :pagination="false"
          :scroll="{ x: '100%' }"
          :loading="
      [STATES.PENDING].includes(state) || [STATES.VALIDATING].includes(state)
    "
        >
          <template #name="{ text: user }">
            <div class="flex items-center align-middle">
              <avatar
                :imageUrl="imageUrl(user.username)"
                :allowUpload="isCurrentUser(user.username)"
                :avatarName="user.name || user.uername || user.email"
                :avatarSize="40"
                class="mr-2"
              />
              <div class="cursor-pointer" @click="() => {showUserPreviewDrawer(user);}">
                <span class="text-gray-900">{{ nameCase(user.name) || "-" }}</span>
                <p class="mb-0 text-gray-500">@{{ user.username || "-" }}</p>
              </div>
            </div>
          </template>

          <template #actions="{ text: user }">
            <a-button-group>
              <a-tooltip v-if="user.enabled" placement="bottom">
                <template #title>
                  <span>Disable User</span>
                </template>
                <a-button size="small" @click="showEnableDisableConfirm(user)">
                  <fa icon="fal user-slash"></fa>
                </a-button>
              </a-tooltip>
              <a-tooltip v-if="!user.enabled" placement="bottom">
                <template #title>
                  <span>Enable User</span>
                </template>
                <a-button size="small" @click="showEnableDisableConfirm(user)">
                  <fa icon="fal user-check"></fa>
                </a-button>
              </a-tooltip>
              <a-tooltip v-if="user.enabled" placement="bottom">
                <template #title>
                  <span>Change Role</span>
                </template>
                <a-button size="small" v-if="user.enabled" @click="handleChangeRole(user)">
                  <fa icon="fal user-shield"></fa>
                </a-button>
              </a-tooltip>
            </a-button-group>
          </template>
        </a-table>
        <div class="flex justify-between max-w-full mt-4">
          <a-button
            type="link"
            size="default"
            @click="toggleUserInvitationList"
            :class="{'opacity-0 pointer-events-none':!loginWithEmailAllowed}"
          >View Pending Invitations</a-button>
          <a-pagination
            :total="pagination.total"
            :current="pagination.current"
            :pageSize="pagination.pageSize"
            @change="handlePagination"
          />
        </div>
      </div>
      <InvitationListTable
        @toggleList="toggleUserInvitationList"
        v-if="listType === 'invitations'"
        :searchText="searchText"
        @showPreview="showUserPreviewDrawer"
        @changeRole="handleChangeRole"
        ref="invitationComponentRef"
      />
    </div>
    <!-- Change Role Modal-->
    <a-modal
      :visible="showChangeRoleModal"
      :destroy-on-close="true"
      title="Change Role"
      :footer="null"
      @cancel="closeChangeRoleModal"
    >
      <ChangeRole
        :user="listType==='users'?selectedUser:selectedInvite"
        :roleList="roleList"
        @updateRole="handleUpdateRole"
      />
    </a-modal>
    <a-modal
      :visible="showInviteUserModal"
      :destroy-on-close="true"
      title="Invite User"
      :footer="null"
      @cancel="closeInviteUserModal"
    >
      <InviteUsers @close="closeInviteUserModal" @handleInviteSent="handleInviteSent" />
    </a-modal>
  </div>
</template>
<script lang="ts">
import { useUserPreview } from "~/composables/user/showUserPreview";
import { defineComponent, ref, reactive, computed, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import useUsers from "~/composables/user/useUsers";
import InvitationListTable from "./invitationListTable.vue";
import { Modal, message } from "ant-design-vue";
import { User } from "~/api/auth/user";
import whoami from "~/composables/user/whoami";
import Avatar from "~/components/common/avatar.vue";
import {
  getNameInitials,
  getNameInTitleCase,
} from "~/composables//utils/string-operations";
import ChangeRole from "./changeRole.vue";
import InviteUsers from "./inviteUsers.vue";
import useRoles from "~/composables/roles/useRoles";
import { useTenantStore } from "~/pinia/tenants";

export default defineComponent({
  components: {
    InvitationListTable,
    ChangeRole,
    InviteUsers,
    Avatar,
  },

  setup() {
    const tenantStore = useTenantStore();
    const loginWithEmailAllowed = ref(
      tenantStore?.tenant?.loginWithEmailAllowed ?? false
    );
    let listType = ref("users");
    const searchText = ref("");
    const showChangeRoleModal = ref(false);
    const showInviteUserModal = ref(false);
    const showUserPreview = ref(false);
    const statusFilterValue = ref<string>("");
    const { username: currentUserUsername } = whoami();
    let selectedUserId = ref("");
    const selectedUser = computed(() => {
      let activeUserObj = {};
      if (userList && userList.value && userList.value.length)
        activeUserObj = userList.value.find(
          (user: any) => user.id === selectedUserId.value
        );
      return activeUserObj;
    });
    const selectedInvite = ref({});
    const invitationComponentRef = ref(null);
    let userListAPIParams: any = reactive({
      limit: 6,
      offset: 0,
      sort: "first_name",
      filter: { $and: [{ email_verified: true }] },
    });
    const pagination = computed(() => {
      return {
        total: filteredUserCount.value,
        pageSize: userListAPIParams.limit,
        current: userListAPIParams.offset / userListAPIParams.limit + 1,
      };
    });
    const { userList, filteredUserCount, getUserList, state, STATES } =
      useUsers(userListAPIParams);
    // fetch roles- need this to find role id when changing user/invite role
    const { roleList } = useRoles();
    const handleSearch = useDebounceFn(() => {
      if (listType.value === "users") searchUserList();
    }, 600);
    const searchUserList = () => {
      let localFilterParams = userListAPIParams.filter.$and;
      let searchFilterIndex = localFilterParams.findIndex((filter: any) => {
        // eslint-disable-next-line no-prototype-builtins
        return filter.hasOwnProperty("$or");
      });
      if (searchFilterIndex > -1) {
        localFilterParams.splice(searchFilterIndex, 1);
      }
      if (searchText.value) {
        userListAPIParams.filter = {
          $and: [
            ...localFilterParams,
            {
              $or: searchText.value
                ? [
                    { first_name: { $ilike: `%${searchText.value}%` } },
                    { last_name: { $ilike: `%${searchText.value}%` } },
                    { username: { $ilike: `%${searchText.value}%` } },
                  ]
                : [],
            },
          ],
        };
        userListAPIParams.offset = 0;
      } else {
        userListAPIParams.filter = {
          $and: [...localFilterParams],
        };
      }
      getUserList();
    };
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
      //add filters
      // let allFilters: any = [];
      // if (Object.keys(filters).length) {
      //   let filterKeys = Object.keys(filters);
      //   filterKeys.forEach((key) => {
      //     filters[key].forEach((value: any) =>
      //       allFilters.push(JSON.parse(value))
      //     );
      //   });
      //   let localFilterParams = [...userListAPIParams.filter.$and];
      //   let enabledFilterIndex = localFilterParams.findIndex((filter) => {
      //     // eslint-disable-next-line no-prototype-builtins
      //     return filter.hasOwnProperty("enabled");
      //   });
      //   if (enabledFilterIndex > -1) {
      //     localFilterParams.splice(enabledFilterIndex, 1);
      //   }
      //   if (allFilters && allFilters.length) {
      //     userListAPIParams.filter = {
      //       $and: [...localFilterParams, ...allFilters],
      //     };
      //     userListAPIParams.offset = 0;
      //   } else {
      //     userListAPIParams.filter = {
      //       $and: [...localFilterParams],
      //     };
      //   }
      // }
      //add sort
      if (Object.keys(sorter).length) {
        let sortValue = "first_name";
        if (sorter.order && sorter.column && sorter.column.sortKey)
          sortValue = `${sorter.order === "descend" ? "-" : ""}${
            sorter.column.sortKey
          }`;
        userListAPIParams.sort = sortValue;
      }
      //modify offset
      // const offset = (pagination.current - 1) * userListAPIParams.limit;
      // userListAPIParams.offset = offset;
      // fetch groups
      getUserList();
    };
    // BEGIN: USER PREVIEW
    const {
      showPreview,
      showUserPreview: openPreview,
      setUserUniqueAttribute,
    } = useUserPreview();
    const showUserPreviewDrawer = (user: any) => {
      setUserUniqueAttribute(user.id);
      openPreview();
      selectedUserId.value = user.id;
    };
    watch(showPreview, () => {
      if (!showPreview.value) reloadTable();
    });
    // END: USER PREVIEW
    const handleChangeRole = (user: any) => {
      showChangeRoleModal.value = true;
      if (listType.value === "users") selectedUserId.value = user.id;
      else Object.assign(selectedInvite.value, user);
    };
    const closeChangeRoleModal = () => {
      showChangeRoleModal.value = false;
      selectedUserId.value = "";
    };
    const handleInviteUsers = (user: any) => {
      showInviteUserModal.value = true;
    };
    const closeInviteUserModal = () => {
      showInviteUserModal.value = false;
    };
    const getModalContent = (user: any, action: "enable" | "disable") => {
      if (user.role !== "admin")
        return `Are you sure you want to ${action} ${
          user.name || user.username || user.email || ""
        }?`;
      return `Admins cannot ${action} other admins. If you still wish to perform this action, downgrade the user's role to Member/Data Steward and then enable the user.`;
    };
    const showEnableDisableConfirm = (user: any) => {
      Modal.confirm({
        title: `${user.enabled ? "Disable User" : "Enable User"}`,
        content: getModalContent(user, user.enabled ? "disable" : "enable"),
        okText: "Yes",
        okType: user.role !== "admin" ? "danger" : "default",
        async onOk() {
          if (user.role !== "admin") {
            const requestPayload = ref({
              enabled: !user.enabled,
            });
            const { data, isReady, error, isLoading } = User.UpdateUser(
              user.id,
              requestPayload
            );
            watch([data, isReady, error, isLoading], () => {
              if (isReady && !error.value && !isLoading.value) {
                getUserList();
                message.success(
                  `User ${user.enabled ? "Disabled" : "Enabled"}`
                );
              } else if (error && error.value) {
                message.error(
                  `Unable to ${
                    user.enabled ? "disable" : "enable"
                  } user. Try again.`
                );
              }
            });
          } else return;
        },
      });
    };
    const toggleUserInvitationList = () => {
      if (listType.value === "users") {
        listType.value = "invitations";
      } else {
        listType.value = "users";
        getUserList();
      }
    };
    const reloadTable = () => {
      if (listType.value === "users") getUserList();
      if (listType.value === "invitations" && invitationComponentRef.value)
        invitationComponentRef.value.getInvitationList();
    };
    const handleUpdateRole = () => {
      message.success("User role updated.");
      closeChangeRoleModal();
      reloadTable();
    };
    const handleInviteSent = () => {
      if (listType.value === "invitations" && invitationComponentRef.value)
        invitationComponentRef.value.getInvitationList();
      closeInviteUserModal();
    };

    const nameCase = (name) => {
      if (name) {
        let nameCaseArray = [];
        let split = name.split(" ");
        split.forEach((element) => {
          nameCaseArray.push(
            element.charAt(0).toUpperCase() + element.substr(1).toLowerCase()
          );
        });
        return nameCaseArray.join(" ");
      }
      return name;
    };
    const imageUrl = (username: any) => {
      return `http://localhost:3333/api/auth/tenants/default/avatars/${username}`;
    };
    const handleStatusFilterChange = () => {
      console.log(statusFilterValue.value);
      let localFilterParams = [...userListAPIParams.filter.$and];
      let enabledFilterIndex = localFilterParams.findIndex((filter) => {
        // eslint-disable-next-line no-prototype-builtins
        return filter.hasOwnProperty("enabled");
      });
      if (enabledFilterIndex > -1) {
        localFilterParams.splice(enabledFilterIndex, 1);
      }
      if (statusFilterValue.value) {
        userListAPIParams.filter = {
          $and: [
            ...localFilterParams,
            statusFilterValue.value === "enabled"
              ? { enabled: true }
              : { enabled: false },
          ],
        };
      } else {
        userListAPIParams.filter = {
          $and: [...localFilterParams],
        };
      }
      userListAPIParams.offset = 0;
      getUserList();
    };
    const resetStatusFilter = () => {
      statusFilterValue.value = "";
      let localFilterParams = [...userListAPIParams.filter.$and];
      let enabledFilterIndex = localFilterParams.findIndex((filter) => {
        // eslint-disable-next-line no-prototype-builtins
        return filter.hasOwnProperty("enabled");
      });
      if (enabledFilterIndex > -1) {
        localFilterParams.splice(enabledFilterIndex, 1);
      }
      userListAPIParams.filter = {
        $and: [...localFilterParams],
      };
      userListAPIParams.offset = 0;
      getUserList();
    };
    const handlePagination = (page) => {
      //modify offset
      const offset = (page - 1) * userListAPIParams.limit;
      userListAPIParams.offset = offset;
      getUserList();
    };
    const isCurrentUser = (username: string) => {
      return username === currentUserUsername.value;
    };
    return {
      searchText,
      handleSearch,
      handleTableChange,
      showUserPreviewDrawer,
      showEnableDisableConfirm,
      toggleUserInvitationList,
      getNameInitials,
      getNameInTitleCase,
      listType,
      pagination,
      userList,
      selectedUser,
      showUserPreview,
      state,
      STATES,
      loginWithEmailAllowed,
      showChangeRoleModal,
      handleChangeRole,
      closeChangeRoleModal,
      handleUpdateRole,
      invitationComponentRef,
      closeInviteUserModal,
      showInviteUserModal,
      handleInviteUsers,
      handleInviteSent,
      reloadTable,
      nameCase,
      imageUrl,
      statusFilterValue,
      handleStatusFilterChange,
      resetStatusFilter,
      handlePagination,
      filteredUserCount,
      isCurrentUser,
      showPreview,
      selectedInvite,
      roleList,
    };
  },
  data() {
    return {
      columns: [
        {
          title: "User",
          key: "user",
          sorter: true,
          width: 320,
          slots: { customRender: "name" },
          sortKey: "first_name",
        },
        {
          title: "Role",
          key: "role",
          sorter: false,
          width: 150,
          slots: { customRender: "role" },
          dataIndex: "role_object.name",
        },
        {
          title: "Groups",
          key: "group",
          sorter: true,
          width: 150,
          slots: { customRender: "group" },
          sortKey: "group_count",
          dataIndex: "group_count_string",
        },
        {
          title: "Status",
          key: "status",
          slots: { customRender: "status" },
          dataIndex: "status_object.status",
          // filters: [
          //   { text: "Active", value: JSON.stringify({ enabled: true }) },
          //   { text: "Disabled", value: JSON.stringify({ enabled: false }) },
          //   // { text: "Locked", value: JSON.stringify({ locked: true }) },
          // ],
          filterMultiple: false,
          width: 150,
        },
        {
          title: "Actions",
          width: 120,
          slots: { customRender: "actions" },
        },
      ],
    };
  },
});
</script>

<style lang="less" module>
</style>