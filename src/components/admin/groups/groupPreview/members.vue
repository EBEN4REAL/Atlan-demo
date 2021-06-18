<template>
  <div class="my-3 mr-5">
    <div v-if="!memberList.value.length" class="flex flex-col items-center justify-center">
      <div class="text-center">
        <p class="text-lg">No members are present in the group.</p>
        <div class="mt-4">
          <a-button size="large" type="primary" ghost @click="handleAddMember">Add Members</a-button>
        </div>
      </div>
    </div>
    <div v-else>
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
          @click="()=>{getGroupMembersList()}"
        >Try again</a-button>
      </div>
      <div v-else class="min-h-screen mt-4">
        <div v-for="user in memberList.value" :key="user.id" class="my-2">
          <div class="flex justify-between">
            <div class="flex items-center">
              <a-avatar
                shape="circle"
                class="mr-1 ant-tag-blue text-primary-500 avatars"
                :size="40"
              >{{ getNameInitials(getNameInTitleCase(`${getUserName(user)}`)) }}</a-avatar>
              <div class="ml-2">
                <div>{{ getUserName(user) }}</div>
                <div>@{{ user.username }}</div>
                <div>{{ pluralizeString("group", user.group_count) }}</div>
              </div>
            </div>
            <a-popover trigger="click" placement="bottom">
              <template #content>
                <span class="text-red-500" @click="() =>removeUserFromGroup(user.id)">Remove User</span>
              </template>
              <fa icon="fal cog"></fa>
            </a-popover>
          </div>
        </div>
        <div
          class="flex justify-center"
          v-if="[STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)"
        >
          <a-spin></a-spin>
        </div>
        <div v-else-if="showLoadMore" class="flex justify-center">
          <a-button @click="handleLoadMore">load more</a-button>
        </div>
      </div>
    </div>
    <a-modal
      :visible="showAddMemberModal"
      title="Add Users"
      :footer="null"
      :destroy-on-close="true"
      @cancel="closeAddGroupModal"
    >
      <AddGroupMembers
        @addMembersToGroup="addMembersToGroup"
        :addMemberLoading="addMemberLoading"
        ref="addUsers"
      />
    </a-modal>
  </div>
</template>


<script lang="ts">
import { message } from "ant-design-vue";
import { ref, reactive, defineComponent, computed, watch } from "vue";
import useGroupMembers from "~/components/admin/groups/useGroupMembers";
import ErrorView from "@common/error/index.vue";
import { debounce } from "~/composables/utils/debounce";
import {
  pluralizeString,
  getNameInitials,
  getNameInTitleCase,
} from "~/composables/utils/string-operations";
import { Group } from "~/api/auth/group";
import { getIsLoadMore } from "~/composables/utils/isLoadMore";
import AddGroupMembers from "~/components/admin/groups/groupPreview/about/members/addGroupMembers.vue";
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
  },
  setup(props, context) {
    const searchText = ref("");
    const showAddMemberModal = ref(false);
    const addMemberLoading = ref(false);
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

    const handleSearch = debounce((input: any) => {
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
    }, 200);
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
    const addMembersToGroup = async (userIds) => {
      addMemberLoading.value = true;
      try {
        await Group.AddMembers(props.selectedGroup.id, {
          users: userIds,
        });
        memberListParams.params.offset = 0;
        getGroupMembersList();
        // TODO: fetch group again
        // await this.FETCH_GROUP_LIST();
        addMemberLoading.value = false;
        message.success(
          `${pluralizeString("Member", userIds.length, false)} added`
        );
        showAddMemberModal.value = false;
      } catch (e) {
        addMemberLoading.value = false;

        message.error("Unable to add members, please try again.");
      }
    };
    const removeUserFromGroup = async (userId: any) => {
      const userIds = [userId];
      try {
        await Group.RemoveMembersFromGroup(
          props.selectedGroup.id,
          {
            users: userIds,
          },
          {}
        );
        memberListParams.params.offset = 0;
        getGroupMembersList();
        // TODO: fetch group again
        // await this.FETCH_GROUP_LIST();
        message.success("Member Removed");
      } catch (error) {
        message.error("Failed, try again");
      }
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
      showAddMemberModal.value = true;
    };
    const closeAddGroupModal = () => {
      showAddMemberModal.value = false;
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
    };
  },
});
</script>

<style>
</style>