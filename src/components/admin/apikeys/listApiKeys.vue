<template>
  <div class="flex flex-row items-center justify-between">
    <a-input-search
      placeholder="Search API..."
      style="width: 300px"
      v-model:value="searchText"
      @change="handleSearch"
      allowClear="true"
    />
    <a-button type="primary" @click="showAPIKeyModal">Create New API</a-button>
  </div>
  <div class="py-6">
    <ErrorView v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"></ErrorView>
    <a-list
      v-else
      item-layout="horizontal"
      :data-source="apiList"
      :pagination="{ pageSize: 7 }"
      :loading="[STATES.PENDING].includes(state)"
      class="px-6 py-4 bg-white apiListContainer"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <template #extra>
            <div class="w-32">
              <div
                class="flex flex-row items-center justify-end"
                v-if="item.created_by === currentUserId"
              >
                <a-button class="mx-4" shape="circle" @click="copyAPI(item)">
                  <fa icon="fal copy"></fa>
                </a-button>
                <a-button shape="circle" @click="deleteAPI(item.id)">
                  <fa icon="fal trash-alt" class="text-red-600"></fa>
                </a-button>
              </div>
            </div>
          </template>
          <a-list-item-meta>
            <template #title>{{ item.name }}</template>
            <template #description>{{ timeAgo(item.created_at) }} ago</template>
          </a-list-item-meta>
          <div
            class="mx-3 cursor-pointer"
            @click="()=>handleClickUser(item.created_by)"
          >{{item.created_by}}</div>
          <div
            class="overflow-x-hidden text-left w-44 hide-initial"
          >{{ item.code.slice(item.code.length - 22) }}</div>
        </a-list-item>
      </template>
    </a-list>
  </div>
  <div>
    <a-modal v-model:visible="isCreateAPI" title="Create API Key">
      <label>Name:</label>
      <a-input v-model:value="apiName" />
      <template #footer>
        <a-button key="back" @click="showAPIKeyModal">Cancel</a-button>
        <a-button
          key="submit"
          type="primary"
          :disabled="!apiName.length"
          @click="createAPIKey"
          :loading="isAPILoading"
        >Create</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
// Todo: Add createdBy user name for each API Key

import { defineComponent, inject, onMounted, ref } from "vue";
import useAPIKeys from "./useAPIKeys";
import { copyToClipboard } from "~/utils/clipboard";
import { message, Modal } from "ant-design-vue";
import ErrorView from "@common/error/index.vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);
import { APIKeyService } from "~/api/auth/apiKeys";
import { debounce } from "~/composables/utils/debounce";
import { useUserPreview } from "~/composables/user/showUserPreview";

export default defineComponent({
  components: { ErrorView },
  setup() {
    const keycloak: any = inject("$keycloak");
    const {
      apiList,
      state,
      STATES,
      AdminrolesId,
      getUpdatedAPI,
      getRoleList,
      searchAPI,
    } = useAPIKeys({
      revalidateOnFocus: false,
      dedupingInterval: 1,
    });
    const isCreateAPI = ref(false);
    const apiName = ref("");
    const isAPILoading = ref(false);
    const searchText = ref("");
    onMounted(() => getRoleList());

    const timeAgo = (time: string) => dayjs().from(time, true);

    const showAPIKeyModal = () => {
      isCreateAPI.value = !isCreateAPI.value;
    };
    const copyAPI = (item: any) => {
      copyToClipboard(item.code);
      message.success({
        content: "API Copied!",
      });
    };

    const handleSearch = debounce(() => {
      searchAPI(searchText.value);
    }, 500);

    const onSearch = (value: string) => {
      searchAPI(value);
    };

    const createAPIKey = async () => {
      isAPILoading.value = true;
      const body = {
        category: "",
        name: apiName.value,
        roleId: AdminrolesId.value,
        roleName: "$admin",
      };
      await APIKeyService.createAPIKey(body);
      getUpdatedAPI();
      showAPIKeyModal();
      apiName.value = "";
      isAPILoading.value = false;
    };

    const deleteAPI = (item: any) => {
      Modal.confirm({
        title: "Delete API Key",
        content: "Are you sure to delete this API key?",
        okType: "danger",
        okText: "Yes",
        cancelText: "No",
        async onOk() {
          await APIKeyService.deleteAPIKey(item);
          getUpdatedAPI();
        },
      });
    };
    // user preview drawer
    const { showUserPreview, setUserUniqueAttribute } = useUserPreview();
    const handleClickUser = (userId: string) => {
      setUserUniqueAttribute(userId);
      showUserPreview({ allowed: ["about"] });
    };

    return {
      copyAPI,
      deleteAPI,
      apiList,
      state,
      STATES,
      currentUserId: keycloak?.tokenParsed?.userId ?? "",
      AdminrolesId,
      onSearch,
      showAPIKeyModal,
      apiName,
      isCreateAPI,
      createAPIKey,
      isAPILoading,
      timeAgo,
      searchText,
      handleSearch,
      handleClickUser,
    };
  },
});
</script>
<style lang="less" scoped>
.apiListContainer {
  min-height: 350px;
}
.hide-initial {
  content: "";
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: rgb(248, 248, 253);
  background: linear-gradient(
    90deg,
    rgba(248, 248, 253, 1) 56%,
    rgba(248, 248, 253, 0.7) 100%
  );
}
</style>
