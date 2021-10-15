<template>
  <div>
    <div class="flex flex-row justify-between">
      <div class="flex" :class="userListHeaderClass">
        <a-button
          v-if="showHeaderButtons"
          class="mr-3"
          @click="$emit('showGroupMembers')"
        >
          <fa class="text-gray-500" icon="fal chevron-left" />
        </a-button>
        <a-input-search
          v-model:value="searchText"
          placeholder="Search users"
          :allow-clear="true"
          class="mr-1"
          @change="handleSearch"
        ></a-input-search>
      </div>
      <div v-if="showHeaderButtons">
        <a-button
          type="primary"
          :loading="addMemberLoading"
          :disabled="addMemberLoading"
          @click="$emit('addMembersToGroup')"
        >
          <fa icon="fal plus" class="mr-2" />Add
        </a-button>
      </div>
    </div>
    <div
      v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
      class="flex flex-col items-center h-full align-middle bg-white"
    >
      <ErrorView>
        <div class="mt-3">
          <a-button
            size="large"
            type="primary"
            ghost
            @click="
              () => {
                getUserList();
              }
            "
          >
            <fa icon="fal sync" class="mr-2"></fa>Try again
          </a-button>
        </div>
      </ErrorView>
    </div>
    <div v-else class="pl-4 mt-2 overflow-auto">
      <a-checkbox-group class="w-full">
        <div class="flex flex-col w-full" :style="userListStyle">
          <template v-for="user in userList.value" :key="user.id">
            <a-checkbox
              :value="user.id"
              class="flex items-center w-full py-2 border-b border-gray-100"
              @change="handleChange"
            >
              <span class="flex justify-between ml-3">
                <div class="flex items-center">
                  <avatar
                    :image-url="imageUrl(user.username)"
                    :allow-upload="false"
                    :avatar-name="user.name || user.uername || user.email"
                    :avatar-size="40"
                    class="mr-2"
                  />
                  <div class="ml-2">
                    <div class="text-gray">
                      <div class="mr-2 font-bold">{{ user.name }}</div>
                      <div class="mr-2 text-gray">{{ user.email }}</div>
                    </div>
                  </div>
                </div>
              </span>
            </a-checkbox>
          </template>
        </div>
      </a-checkbox-group>
      <div
        v-if="
          [STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)
        "
        class="flex justify-center mt-3"
      >
        <a-spin></a-spin>
      </div>
      <div v-else-if="showLoadMore" class="flex justify-center mt-3">
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
import Avatar from "~/components/common/avatar.vue";

export default defineComponent({
  name: "Users",
  components: {
    ErrorView,
    Avatar,
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
    userListHeaderClass: {
      type: String,
      default: "",
    },
    userListStyle: {
      type: Object,
      default: {},
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
      filteredUserCount,
      getUserList,
      state,
      STATES,
    } = useUsers(userListAPIParams);

    const handleSearch = useDebounceFn(() => {
      userListAPIParams.filter = {
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
      };

      userListAPIParams.offset = 0;
      getUserList();
    }, 200);
    const handleLoadMore = () => {
      userListAPIParams.offset += userListAPIParams.limit;
      getUserList();
    };
    const showLoadMore = computed(() => getIsLoadMore(
        // TODO: check if there's a better way access memberList and not use ref in a ref
        userList.value.value.length,
        userListAPIParams.offset,
        userListAPIParams.limit,
        filteredUserCount.value // filtered value because we are filtering users in the getUsers API call and getting only the users that have email_verified as true.
      ));
    const handleChange = (event) => {
      if (
        event.target.checked &&
        !selectedIds.value.includes(event.target.value)
      ) {
        selectedIds.value.push(event.target.value);
      } else if (!event.target.checked) {
        const index = selectedIds.value.indexOf(event.target.value);
        if (index > -1) {
          selectedIds.value.splice(index, 1);
        }
      }
      context.emit("updateSelectedUsers", selectedIds.value);
    };
    const imageUrl = (username: any) => `${window.location.origin}/api/service/avatars/${username}`;
    return {
      searchText,
      showLoadMore,
      userList,
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
      imageUrl,
    };
  },
});
</script>
  
<style lang="less" scoped>
.userlist-height {
  max-height: calc(100vh - 35rem);
}
</style>