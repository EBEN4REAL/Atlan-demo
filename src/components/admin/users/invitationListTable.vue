<template>
  <a-table
    :dataSource="invitationList"
    :columns="columns"
    v-if="invitationList && invitationList.length"
    :rowKey="(invitation)=>invitation.id"
    :pagination="pagination"
    @change="handleTableChange"
    :loading="[STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)"
  >
    <template #invites="{text:invite}">
      <div class="flex cursor-pointer" @click="() => {handleInvitationClick(invite)}">
        <div>
          <a-avatar
            v-if="invite.username||invite.email"
            shape="circle"
            class="mr-1 ant-tag-blue text-primary-500 avatars"
          >{{getNameInitials(getNameInTitleCase(invite.username||invite.email)) }}</a-avatar>
        </div>
        <div>
          <span>{{ invite.email || '-' }}</span>
          <p>@{{ invite.username || '-'}}</p>
        </div>
      </div>
    </template>
    <template #role="{text:invite}">
      <span>{{ invite.role_object.name }}</span>
    </template>
    <template #actions="{text:invite}">
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
          <fa icon="fal cog" />
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item
              key="0"
              @click="handleResendVerificationEmail(invite)"
            >Resend Verification Email</a-menu-item>
            <a-menu-item key="1" @click="handleRevokeInvitation(invite)">Revoke Invitation</a-menu-item>
            <a-menu-item key="2" @click="handleChangeRole(invite)">Change User Role</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-table>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from "vue";
import { debounce } from "~/composables/utils/debounce";
import useInvitations from "./useInvitations";
import {
  getNameInitials,
  getNameInTitleCase,
} from "~/composables//utils/string-operations";
import { Modal, message } from "ant-design-vue";
import { User } from "~/api/auth/user";
export default defineComponent({
  name: "InvitationListTable",
  props: {
    searchText: {
      type: String,
      deafult: "",
    },
  },
  setup(props, context) {
    let invitationListAPIParams: any = reactive({
      limit: 6,
      offset: 0,
      sort: "first_name",
      filter: { $and: [{ email_verified: false }] },
    });
    const pagination = computed(() => {
      return {
        total: filteredInvitationCount.value,
        pageSize: invitationListAPIParams.limit,
        current:
          invitationListAPIParams.offset / invitationListAPIParams.limit + 1,
      };
    });
    const {
      userList: invitationList,
      filteredUserCount: filteredInvitationCount,
      getUserList: getInvitationList,
      state,
      STATES,
    } = useInvitations(invitationListAPIParams);
    const handleSearch = debounce(() => {
      searchInvitationList();
    }, 600);
    watch(() => props.searchText, handleSearch);

    const searchInvitationList = () => {
      let localFilterParams = invitationListAPIParams.filter.$and;
      let searchFilterIndex = localFilterParams.findIndex((filter: any) => {
        // eslint-disable-next-line no-prototype-builtins
        return filter.hasOwnProperty("$or");
      });
      if (searchFilterIndex > -1) {
        localFilterParams.splice(searchFilterIndex, 1);
      }
      if (props.searchText) {
        invitationListAPIParams.filter = {
          $and: [
            ...localFilterParams,
            {
              $or: props.searchText
                ? [
                    { email: { $ilike: `%${props.searchText}%` } },
                    { username: { $ilike: `%${props.searchText}%` } },
                  ]
                : [],
            },
          ],
        };
        invitationListAPIParams.offset = 0;
      } else {
        invitationListAPIParams.filter = {
          $and: [...localFilterParams],
        };
      }
      getInvitationList();
      //TODO: fetch roles
      // getRolesList();
    };
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
      //add filters
      let allFilters: any = [];
      if (Object.keys(filters).length) {
        let filterKeys = Object.keys(filters);
        filterKeys.forEach((key) => {
          filters[key].forEach((value: any) =>
            allFilters.push(JSON.parse(value))
          );
        });
        let localFilterParams = [...invitationListAPIParams.filter.$and];
        let enabledFilterIndex = localFilterParams.findIndex((filter) => {
          // eslint-disable-next-line no-prototype-builtins
          return filter.hasOwnProperty("enabled");
        });
        if (enabledFilterIndex > -1) {
          localFilterParams.splice(enabledFilterIndex, 1);
        }
        if (allFilters && allFilters.length) {
          invitationListAPIParams.filter = {
            $and: [...localFilterParams, ...allFilters],
          };
          invitationListAPIParams.offset = 0;
        } else {
          invitationListAPIParams.filter = {
            $and: [...localFilterParams],
          };
        }
      }
      //add sort
      if (Object.keys(sorter).length) {
        let sortValue = "first_name";
        if (sorter.order && sorter.column && sorter.column.sortKey)
          sortValue = `${sorter.order === "descend" ? "-" : ""}${
            sorter.column.sortKey
          }`;
        invitationListAPIParams.sort = sortValue;
      }
      //modify offset
      const offset = (pagination.current - 1) * invitationListAPIParams.limit;
      invitationListAPIParams.offset = offset;
      // fetch groups
      getInvitationList();
    };
    const handleInvitationClick = (invite: any) => {
      context.emit("showPeview", invite);
    };
    const handleChangeRole = (invite: any) => {
      context.emit("changeRole", invite);
    };
    return {
      handleTableChange,
      handleInvitationClick,
      getInvitationList,
      getNameInitials,
      getNameInTitleCase,
      handleChangeRole,
      pagination,
      invitationList,
      state,
      STATES,
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
          slots: { customRender: "invites" },
          sortKey: "email",
        },
        {
          title: "Role",
          key: "role",
          width: 150,
          slots: { customRender: "role" },
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

<style>
</style>