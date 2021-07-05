<template>
  <div class="my-3 mr-5">
    <div v-if="showUserGroups">
      <div class="flex flex-row justify-between">
        <div>
          <a-input-search
            placeholder="Search Groups"
            :allowClear="true"
            class="mr-1"
            v-model:value="searchText"
            @change="handleSearch"
          ></a-input-search>
        </div>
        <div>
          <a-button type="primary" ghost @click="handleAddToGroup">
            <fa icon="fal plus" class="mr-2"></fa>Add to group
          </a-button>
        </div>
      </div>
      <div v-if="!selectedUser.group_count" class="flex flex-col items-center justify-center">
        <div class="text-center">
          <p class="text-lg">This user is not part of any group.</p>
        </div>
      </div>
      <div
        class="flex flex-col items-center h-full align-middle bg-white"
        style="min-height: 200px"
        v-else-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
      >
        <ErrorView></ErrorView>
        <div class="mt-3">
          <a-button
            size="large"
            type="primary"
            ghost
            @click="
              () => {
                getUserGroupList();
              }
            "
          >
            <fa icon="fal sync"></fa>Try again
          </a-button>
        </div>
      </div>
      <div
        v-else-if="searchText && !filteredGroupCount"
        class="mt-2"
      >{{ `No group with name ${searchText} found.` }}</div>
      <div v-else class="min-h-screen mt-4">
        <div v-for="group in groupList.value" :key="group.id" class="my-2">
          <div class="flex justify-between">
            <div class="flex items-center">
              <!-- <a-avatar
                shape="circle"
                class="mr-1 ant-tag-blue text-primary-500 avatars"
                :size="40"
              >{{ getNameInitials(getNameInTitleCase(group.name)) }}</a-avatar>-->
              <div class="ml-2">
                <div>{{ group.name }}</div>
                <div>@{{ group.alias }}</div>
                <div>{{group.memberCountString}}</div>
              </div>
            </div>
            <a-popover trigger="click" placement="bottom">
              <template #content>
                <a-button
                  :loading="removeFromGroupLoading"
                  type="link"
                  class="px-1 text-red-500"
                  @click="() => removeUserFromGroup(group)"
                >Remove User</a-button>
              </template>
              <fa icon="fal cog" class="cursor-pointer"></fa>
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
    <div v-else-if="!showUserGroups">
      <GroupList
        @updateSelectedGroups="updateSelectedGroups"
        @showUserGroups="handleShowUserGroups"
        @addUserToGroups="addUserToGroups"
        :addToGroupLoading="addToGroupLoading"
      />
    </div>
  </div>
</template>
  
<script lang='ts'>
import { message } from "ant-design-vue";
import GroupList from "~/components/admin/users/userPreview/groups/groupList.vue";
import getUserGroups from "~/composables/user/getUserGroups";
import { defineComponent, computed, reactive, ref } from "vue";
import {
  pluralizeString,
  getNameInitials,
  getNameInTitleCase,
} from "~/composables//utils/string-operations";
import { getIsLoadMore } from "~/composables/utils/isLoadMore";
import { useDebounceFn } from "@vueuse/core";
import ErrorView from "@common/error/index.vue";
import { Group } from "~/api/auth/group";
import { User } from "~/api/auth/user";
import AddToGroup from "~/components/admin/users/userPreview/groups/addUserToGroups.vue";

export default defineComponent({
  name: "UserPreviewGroups",
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
  },
  components: {
    AddToGroup,
    ErrorView,
    GroupList,
  },
  setup(props, context) {
    const showUserGroups = ref(true);
    const searchText = ref("");
    const showAddToGroupModal = ref(false);
    const addToGroupLoading = ref(false);
    const removeFromGroupLoading = ref(false);
    const selectedGroupIds = ref([]);
    const groupListAPIParams = reactive({
      userId: props.selectedUser.id,
      params: {
        limit: 10,
        offset: 0,
        sort: "name",
        filter: {},
      },
    });
    const {
      groupList,
      totalGroupCount,
      filteredGroupCount,
      getUserGroupList,
      state,
      STATES,
    } = getUserGroups(groupListAPIParams);
    const handleSearch = useDebounceFn((input: any) => {
      groupListAPIParams.params.filter = searchText.value
        ? {
            $or: [
              { name: { $ilike: `%${searchText.value}%` } },
              { alias: { $ilike: `%${searchText.value}%` } },
            ],
          }
        : {};
      groupListAPIParams.params.offset = 0;
      getUserGroupList();
    }, 200);
    const handleLoadMore = () => {
      groupListAPIParams.params.offset =
        groupListAPIParams.params.offset + groupListAPIParams.params.limit;
      getUserGroupList();
    };
    let showLoadMore = computed(() => {
      return getIsLoadMore(
        // TODO: check if there's a better way access memberList and not use ref in a ref
        groupList.value.length,
        groupListAPIParams.params.offset,
        groupListAPIParams.params.limit,
        searchText.value ? filteredGroupCount.value : totalGroupCount.value
      );
    });
    const addUserToGroups = async () => {
      const groupIds = [...selectedGroupIds.value];
      addToGroupLoading.value = true;
      try {
        await User.AddGroups(props.selectedUser.id, {
          groups: groupIds,
        });
        groupListAPIParams.params.offset = 0;
        getUserGroupList();
        context.emit("updatedUser");
        addToGroupLoading.value = false;
        message.success(`User added to groups`);
        // showAddToGroupModal.value = false;
        showUserGroups.value = true;
      } catch (e) {
        addToGroupLoading.value = false;
        message.error("Unable to add user to groups, please try again.");
      }
    };

    const removeUserFromGroup = async (group: any) => {
      const userIds = [props.selectedUser.id];
      try {
        removeFromGroupLoading.value = true;
        await Group.RemoveMembersFromGroup(
          group.id,
          {
            users: userIds,
          },
          {}
        );
        getUserGroupList();
        context.emit("updatedUser");
        removeFromGroupLoading.value = false;
        message.success(
          `${props.selectedUser.name} removed from ${group.name}`
        );
      } catch (error) {
        removeFromGroupLoading.value = false;
        message.error(
          `Failed to remove ${props.selectedUser.name} from  ${group.name}, please try again.`
        );
      }
    };
    const handleAddToGroup = () => {
      // showAddToGroupModal.value = true;
      showUserGroups.value = false;
    };
    const handleShowUserGroups = () => {
      // showAddToGroupModal.value = false;
      showUserGroups.value = true;
    };
    const updateSelectedGroups = (groupList) => {
      selectedGroupIds.value = [...groupList];
    };

    return {
      groupList,
      totalGroupCount,
      filteredGroupCount,
      handleLoadMore,
      handleSearch,
      handleAddToGroup,
      removeUserFromGroup,
      getNameInitials,
      getNameInTitleCase,
      pluralizeString,
      getUserGroupList,
      searchText,
      showLoadMore,
      state,
      STATES,
      addToGroupLoading,
      removeFromGroupLoading,
      showAddToGroupModal,
      addUserToGroups,
      updateSelectedGroups,
      showUserGroups,
      handleShowUserGroups,
    };
  },
});
</script>
  
  <style lang="less" module>
</style>
  