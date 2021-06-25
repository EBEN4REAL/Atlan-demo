<template>
  <div class="max-h-full">
    <div v-if="selectedUser && selectedUser.id">
      <div class="flex mb-3">
        <div>
          <a-upload
            accept="image/*"
            class="cursor-pointer"
            :customRequest="handleUploadAvatar"
            :show-upload-list="false"
            v-if="isCurrentUser"
          >
            <div
              class="text-center border-2 rounded-lg border-primary-300 sm:block"
              style="width: 56px; height: 56px"
              v-if="!isReady && uploadStarted"
            >
              <a-spin size="small" class style="margin-top: 18px"></a-spin>
            </div>
            <a-avatar
              v-else
              :key="uploadKey"
              shape="square"
              :size="48"
              class="mr-2 border-2 rounded-lg ant-tag-blue text-primary-500 avatars border-primary-300"
              :src="imageUrl"
            >
              {{
              getNameInitials(
              getNameInTitleCase(selectedUser.name)
              )
              }}
            </a-avatar>
          </a-upload>
          <a-avatar
            v-else
            shape="square"
            :size="48"
            class="mr-2 border-2 rounded-lg ant-tag-blue text-primary-500 avatars border-primary-300"
            :src="userImageUrl(selectedUser.username)"
          >{{ getNameInitials(getNameInTitleCase(selectedUser.name)) }}</a-avatar>
        </div>
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
import uploadAvatar from "~/composables/avatar/uploadAvatar";
import whoami from "~/composables/user/whoami";
export default defineComponent({
  name: "UserPreview",
  components: {
    About,
    Groups,
    AccessLogs,
    Sessions,
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
    let uploadStarted = ref(false);
    const { username } = whoami();
    let isCurrentUser = computed(() => {
      return username.value === props.selectedUser.username;
    });
    const { upload, isReady, uploadKey } = uploadAvatar();
    const handleUploadAvatar = async (uploaded) => {
      console.log("handle Upload");
      upload(uploaded.file);
      uploadStarted.value = true;
      imageUrl.value = imageUrl.value + "?" + uploadKey;
      context.emit("updatedUser");
      return true;
    };
    let imageUrl = ref(
      `http://localhost:3333/api/auth/tenants/default/avatars/${username.value}`
    );
    const userImageUrl = (username: any) => {
      return `http://localhost:3333/api/auth/tenants/default/avatars/${props.selectedUser.username}`;
    };
    return {
      getNameInitials,
      getNameInTitleCase,
      isReady,
      uploadKey,
      handleUploadAvatar,
      imageUrl,
      isCurrentUser,
      userImageUrl,
      uploadStarted,
    };
  },
});
</script>
    
    <style></style>
    