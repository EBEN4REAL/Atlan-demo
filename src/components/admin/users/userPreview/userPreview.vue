<template>
  <div class="max-h-full">
    <div v-if="selectedUser && selectedUser.id">
      <div class="flex mb-3">
        <avatar
          :imageUrl="imageUrl"
          :allowUpload="isCurrentUser"
          :avatarName="selectedUser.name || selectedUser.uername || selectedUser.email"
          :avatarSize="48"
          @imageUpdated="(emitPayload)=>$emit('imageUpdated',emitPayload)"
          class="mr-2"
        />
        <div class="ml-3">
          <div
            class="text-lg font-bold capitalize cursor-pointer text-primary-500"
          >{{ selectedUser.name }}</div>
        </div>
      </div>
      <a-tabs>
        <a-tab-pane v-for="tab in tabs" :key="tab.name">
          <template #tab>
            <span class="mb-0">{{ tab.name }}</span>
          </template>
          <component
            :isCurrentUser="isCurrentUser"
            :is="tab.component"
            :selectedUser="selectedUser"
            @updatedUser="$emit('updatedUser')"
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
export default defineComponent({
  name: "UserPreview",
  components: {
    About,
    Groups,
    AccessLogs,
    Sessions,
    Avatar,
  },
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
    tabs: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    const { username } = whoami();
    let isCurrentUser = computed(() => {
      return username.value === props.selectedUser.username;
    });
    // const imageUrl = (username: any) => {
    //   return `http://localhost:3333/api/auth/tenants/default/avatars/${username}`;
    // };
    const imageUrl = computed(() => {
      if (props.selectedUser && props.selectedUser.username)
        return `http://localhost:3333/api/auth/tenants/default/avatars/${props.selectedUser.username}`;
      return "";
    });
    return {
      getNameInitials,
      getNameInTitleCase,
      imageUrl,
      isCurrentUser,
    };
  },
});
</script>
    
    <style></style>
    