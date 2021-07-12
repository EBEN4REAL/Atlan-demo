<template>
  <div class="h-full">
    <div class="flex items-center justify-center h-full" v-if="isLoading">
      <a-spin />
    </div>
    <div
      class="flex flex-col items-center justify-center h-full bg-white"
      v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
    >
      <ErrorView>
        <div class="mt-3">
          <a-button size="large" type="primary" ghost @click="()=>{getUser();}">
            <fa icon="fal sync" class="mr-2"></fa>Try again
          </a-button>
        </div>
      </ErrorView>
    </div>
    <div v-else-if="selectedUser && selectedUser.id">
      <div class="flex mb-3">
        <avatar
          :imageUrl="imageUrl"
          :allowUpload="isCurrentUser"
          :avatarName="
            selectedUser.name || selectedUser.uername || selectedUser.email
          "
          :avatarSize="48"
          class="mr-2"
        />
        <div class="ml-3">
          <div class="text-lg font-bold capitalize cursor-pointer text-gray">{{ selectedUser.name }}</div>
        </div>
      </div>
      <a-tabs :defaultActiveKey="activeKey">
        <a-tab-pane v-for="tab in tabs" :key="tab.name">
          <template #tab>
            <span class="mb-0">{{ tab.name }}</span>
          </template>
          <component
            class="overflow-auto component-height"
            :isCurrentUser="isCurrentUser"
            :is="tab.component"
            :selectedUser="selectedUser"
            @updatedUser="handleUserUpdate"
          />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import {
  getNameInitials,
  getNameInTitleCase,
} from "~/composables/utils/string-operations";
import { defineComponent, ref, computed } from "vue";
import About from "./about.vue";
import Groups from "./groups.vue";
import AccessLogs from "./accessLogs.vue";
import Sessions from "./sessions.vue";
import whoami from "~/composables/user/whoami";
import Avatar from "~/components/common/avatar.vue";
import { useUserPreview } from "~/composables/user/showUserPreview";
import { useUser } from "~/composables/user/useUsers";
import ErrorView from "@common/error/index.vue";
export default defineComponent({
  name: "UserPreview",
  components: {
    About,
    Groups,
    AccessLogs,
    Sessions,
    Avatar,
    ErrorView,
  },
  setup(props, context) {
    const {
      userId,
      username: userUsername,
      uniqueAttribute,
      finalTabs,
      defaultTab,
    } = useUserPreview();
    const activeKey = defaultTab;
    let filterObj = {};
    if (uniqueAttribute.value === "username")
      filterObj = {
        $and: [{ email_verified: true }, { username: userUsername.value }],
      };
    else filterObj = { $and: [{ email_verified: true }, { id: userId.value }] };
    const { userList, getUser, isLoading, state, STATES } = useUser({
      limit: 1,
      offset: 0,
      sort: "first_name",
      filter: filterObj,
    });
    const userObj = computed(() => {
      return userList && userList.value && userList.value.length
        ? userList.value[0]
        : [];
    });
    const { username } = whoami();
    let isCurrentUser = computed(() => {
      return username.value === userObj.value.username;
    });
    const imageUrl = computed(() => {
      if (userObj.value && userObj.value.username)
        return `http://localhost:3333/api/auth/tenants/default/avatars/${userObj.value.username}`;
      return "";
    });
    const handleUserUpdate = async () => {
      await getUser();
    };
    return {
      getNameInitials,
      getNameInTitleCase,
      imageUrl,
      isCurrentUser,
      selectedUser: userObj,
      userId,
      tabs: finalTabs,
      handleUserUpdate,
      isLoading,
      state,
      STATES,
      activeKey,
      getUser,
    };
  },
});
</script>
    
<style lang="less" scoped>
.component-height {
  max-height: calc(100vh - 12rem);
}
</style>
    