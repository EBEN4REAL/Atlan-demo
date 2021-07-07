<template>
  <div class="my-3 mr-5">
    <div v-if="showGroupMembers">
      <div class="flex flex-row justify-between">
        <div>
          <a-input-search
            placeholder="Search Members"
            :allowClear="true"
            class="mr-1"
            v-model:value="searchText"
            @change="handleSearch"
          ></a-input-search>
        </div>
        <div>
          <a-button type="primary" ghost @click="handleAddMember">Add Member</a-button>
        </div>
      </div>
      <div v-if="!selectedGroup.memberCount" class="flex flex-col items-center justify-center">
        <div class="text-center">
          <p class="text-lg">No members are present in the group.</p>
        </div>
      </div>
      <div
        class="flex items-center h-full align-middle bg-white"
        style="min-height: 200px"
        v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
      >
        <ErrorView></ErrorView>
        <a-button
          icon="reload"
          size="large"
          type="primary"
          ghost
          @click="
            () => {
              getGroupMembersList();
            }
          "
        >Try again</a-button>
      </div>
      <div v-else-if="searchText && !filteredMembersCount" class="mt-2">
        {{ `No member with name ${searchText} found.` }}
        <!-- <span
          class="cursor-pointer text-gray"
          @click="{searchText='';handleSearch();}"
        >Clear</span>-->
      </div>
      <div v-else class="min-h-screen mt-4">
        <div v-for="user in memberList.value" :key="user.id" class="my-2">
          <div class="flex justify-between cursor-pointer">
            <div class="flex items-center" @click="() => handleClickUser(user.username)">
              <a-avatar shape="circle" class="mr-1 ant-tag-blue text-gray avatars" :size="40">
                {{
                getNameInitials(getNameInTitleCase(`${getUserName(user)}`))
                }}
              </a-avatar>
              <div class="ml-2">
                <div>{{ getUserName(user) }}</div>
                <div>@{{ user.username }}</div>
                <div>{{ pluralizeString("group", user.group_count) }}</div>
              </div>
            </div>
            <a-popover trigger="click" placement="bottom">
              <template #content>
                <span class="text-red-500" @click="() => removeUserFromGroup(user.id)">Remove User</span>
              </template>
              <fa icon="fal cog"></fa>
            </a-popover>
          </div>
        </div>
        <div
          class="flex justify-center"
          v-if="
            [STATES.PENDING].includes(state) ||
            [STATES.VALIDATING].includes(state)
          "
        >
          <a-spin></a-spin>
        </div>
        <div v-else-if="showLoadMore" class="flex justify-center">
          <a-button @click="handleLoadMore">load more</a-button>
        </div>
      </div>
    </div>
    <div v-else-if="!showGroupMembers">
      <UserList
        @updateSelectedUsers="updateSelectedUsers"
        @showGroupMembers="handleShowGroupMembers"
        @addMembersToGroup="addMembersToGroup"
        :addMemberLoading="addMemberLoading"
        :showHeaderButtons="true"
      />
    </div>
    <!-- <a-modal
      :visible="showAddMemberModal"
      title="Add Members"
      :footer="null"
      :destroy-on-close="true"
      @cancel="closeAddGroupModal"
    >
      <AddGroupMembers
        @addMembersToGroup="addMembersToGroup"
        :addMemberLoading="addMemberLoading"
        ref="addUsers"
      />
    </a-modal>-->
  </div>
</template>


<script lang="ts">
import { message } from "ant-design-vue";
import UserList from "~/components/admin/groups/common/userList.vue";
import { ref, reactive, defineComponent, computed, watch } from "vue";
import useGroupMembers from "~/composables/group/useGroupMembers";
import ErrorView from "@common/error/index.vue";
import { useDebounceFn } from "@vueuse/core";
import {
  pluralizeString,
  getNameInitials,
  getNameInTitleCase,
} from "~/composables/utils/string-operations";
import { Group } from "~/api/auth/group";
import { getIsLoadMore } from "~/composables/utils/isLoadMore";
import AddGroupMembers from "~/components/admin/groups/groupPreview/about/members/addGroupMembers.vue";
import { useUserPreview } from "~/composables/user/showUserPreview";

export default defineComponent({
  name: "GroupMembers",
  props: {
    selectedGroup: {
      type: Object,
      default: {},
    },
  },
  components: {
    ErrorView,
    AddGroupMembers,
    UserList,
  },
  setup(props, context) {
    const showGroupMembers = ref(true);
    const searchText = ref("");
    const showAddMemberModal = ref(false);
    const addMemberLoading = ref(false);
    const removeMemberLoading = ref(false);
    const selectedUserIds = ref([]);
    const memberListParams = reactive({
      groupId: props.selectedGroup.id,
      params: {
        limit: 10,
        offset: 0,
        sort: "first_name",
        filter: {},
      },
    });
    const {
      memberList,
      totalMembersCount,
      filteredMembersCount,
      getGroupMembersList,
      state,
      STATES,
    } = useGroupMembers(memberListParams);

    const handleSearch = useDebounceFn(() => {
      memberListParams.params.filter = searchText.value
        ? {
            $or: [
              { first_name: { $ilike: `%${searchText.value}%` } },
              { last_name: { $ilike: `%${searchText.value}%` } },
              { username: { $ilike: `%${searchText.value}%` } },
            ],
          }
        : {};
      memberListParams.params.offset = 0;
      getGroupMembersList();
    }, 600);
    const handleLoadMore = () => {
      memberListParams.params.offset =
        memberListParams.params.offset + memberListParams.params.limit;
      getGroupMembersList();
    };
    let showLoadMore = computed(() => {
      return getIsLoadMore(
        // TODO: check if there's a better way access memberList and not use ref in a ref
        memberList.value.value.length,
        memberListParams.params.offset,
        memberListParams.params.limit,
        searchText.value ? filteredMembersCount.value : totalMembersCount.value
      );
    });
    const addMembersToGroup = () => {
      const userIds = [...selectedUserIds.value];
      const requestPayload = ref();
      requestPayload.value = {
        users: userIds,
      };
      const { data, isReady, error, isLoading } = Group.AddMembers(
        props.selectedGroup.id,
        requestPayload
      );
      watch(
        [data, isReady, error, isLoading],
        () => {
          addMemberLoading.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            memberListParams.params.offset = 0;
            getGroupMembersList();
            context.emit("refreshTable");
            message.success(
              `${pluralizeString("Member", userIds.length, false)} added`
            );
            showGroupMembers.value = true;
          } else if (error && error.value) {
            message.error("Unable to add members, please try again.");
          }
        },
        { immediate: true }
      );
    };
    const removeUserFromGroup = async (userId: any) => {
      const userIds = [userId];
      const requestPayload = ref();
      requestPayload.value = {
        users: userIds,
      };
      const { data, isReady, error, isLoading } = Group.RemoveMembersFromGroup(
        props.selectedGroup.id,
        requestPayload
      );
      watch(
        [data, isReady, error, isLoading],
        () => {
          removeMemberLoading.value = isLoading.value;
          if (isReady && !error.value && !isLoading.value) {
            memberListParams.params.offset = 0;
            getGroupMembersList();
            context.emit("refreshTable");
            message.success("Member Removed");
          } else if (error && error.value) {
            message.error("Failed, try again");
          }
        },
        { immediate: true }
      );
    };
    const getUserName = (user: any) => {
      const { first_name } = user;
      const { last_name } = user;
      if (first_name) {
        return `${first_name} ${last_name || ""}`;
      }
      return user.email;
    };
    const handleAddMember = () => {
      // showAddMemberModal.value = true;
      showGroupMembers.value = false;
    };
    const handleShowGroupMembers = () => {
      // showAddToGroupModal.value = false;
      showGroupMembers.value = true;
    };
    const closeAddGroupModal = () => {
      showAddMemberModal.value = false;
    };
    // user preview drawer
    const { showUserPreview, setUserUniqueAttribute } = useUserPreview();
    const handleClickUser = (username: string) => {
      setUserUniqueAttribute(username, "username");
      showUserPreview({ allowed: ["about"] });
    };
    const updateSelectedUsers = (userList) => {
      selectedUserIds.value = [...userList];
    };
    return {
      searchText,
      showLoadMore,
      memberList,
      totalMembersCount,
      filteredMembersCount,
      getGroupMembersList,
      handleSearch,
      state,
      STATES,
      handleLoadMore,
      removeUserFromGroup,
      getUserName,
      getNameInitials,
      getNameInTitleCase,
      pluralizeString,
      handleAddMember,
      showAddMemberModal,
      addMembersToGroup,
      addMemberLoading,
      closeAddGroupModal,
      handleClickUser,
      showGroupMembers,
      handleShowGroupMembers,
      updateSelectedUsers,
      removeMemberLoading,
    };
  },
});
</script>

<style>
</style>