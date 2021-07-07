<template>
  <div>
    <div class="flex flex-row justify-between">
      <div>
        <a-input-search
          placeholder="Search Users"
          :allowClear="true"
          class="mr-1"
          v-model:value="searchText"
          @change="handleSearch"
        ></a-input-search>
      </div>
      <div v-if="showHeaderButtons">
        <a-button @click="$emit('showGroupMembers')" class="mr-3">
          <fa icon="fal chevron-left" />
        </a-button>
        <a-button
          @click="$emit('addMembersToGroup')"
          type="primary"
          :loading="addMemberLoading"
          :disabled="addMemberLoading"
        >
          <fa icon="fal plus" class="mr-2" />Add
        </a-button>
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
            getUserList();
          }
        "
      >Try again</a-button>
    </div>
    <div v-else class="mt-4 overflow-auto">
      <a-checkbox-group v-model:value="selectedIds" @change="handleChange" class="w-full">
        <div class="flex flex-col w-full">
          <template v-for="user in userList.value" :key="user.id">
            <a-checkbox :value="user.id" class="flex items-center w-full">
              <span class="flex justify-between mb-2">
                <div class="flex items-center">
                  <a-avatar shape="circle" class="mr-1 ant-tag-blue text-gray avatars">
                    {{
                    getNameInitials(getNameInTitleCase(user.name))
                    }}
                  </a-avatar>
                  <div class="ml-2">
                    <div>{{ user.name }}</div>
                    <div class="text-xs">@{{ user.username }}</div>
                    <div class="text-xs">{{ user.group_count_string }}</div>
                  </div>
                </div>
              </span>
            </a-checkbox>
          </template>
        </div>
      </a-checkbox-group>
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
</template>
<script lang="ts">
import { ref, reactive, defineComponent, computed } from "vue";
import ErrorView from "@common/error/index.vue";
import { useDebounceFn } from "@vueuse/core";
import {
  pluralizeString,
  getNameInitials,
  getNameInTitleCase,
} from "~/composables/utils/string-operations";
import { getIsLoadMore } from "~/composables/utils/isLoadMore";
import useUsers from "~/composables/user/useUsers";
export default defineComponent({
  name: "Users",
  components: {
    ErrorView,
  },
  props: {
    addMemberLoading: {
      type: Boolean,
      default: false,
    },
    showHeaderButtons: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const selectedIds = ref([]);
    const searchText = ref("");
    const userListAPIParams = reactive({
      limit: 10,
      offset: 0,
      sort: "first_name",
      filter: {
        $and: [
          {
            email_verified: true,
          },
        ],
      },
    });
    const {
      usersListConcatenated: userList,
      totalUserCount,
      filteredUserCount,
      getUserList,
      state,
      STATES,
    } = useUsers(userListAPIParams);

    const handleSearch = useDebounceFn(() => {
      userListAPIParams.filter = searchText.value
        ? {
            $and: [
              { email_verified: true },
              {
                $or: [
                  { first_name: { $ilike: `%${searchText.value}%` } },
                  { last_name: { $ilike: `%${searchText.value}%` } },
                  { username: { $ilike: `%${searchText.value}%` } },
                ],
              },
            ],
          }
        : {};
      userListAPIParams.offset = 0;
      getUserList();
    }, 200);
    const handleLoadMore = () => {
      userListAPIParams.offset =
        userListAPIParams.offset + userListAPIParams.limit;
      getUserList();
    };
    let showLoadMore = computed(() => {
      return getIsLoadMore(
        // TODO: check if there's a better way access memberList and not use ref in a ref
        userList.value.value.length,
        userListAPIParams.offset,
        userListAPIParams.limit,
        searchText.value ? filteredUserCount.value : totalUserCount.value
      );
    });
    const handleChange = () => {
      context.emit("updateSelectedUsers", selectedIds.value);
    };
    return {
      searchText,
      showLoadMore,
      userList,
      totalUserCount,
      filteredUserCount,
      getUserList,
      handleSearch,
      state,
      STATES,
      handleLoadMore,
      getNameInitials,
      getNameInTitleCase,
      pluralizeString,
      handleChange,
      selectedIds,
    };
  },
});
</script>
  
<style></style>