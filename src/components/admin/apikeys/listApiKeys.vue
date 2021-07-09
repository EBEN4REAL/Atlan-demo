<template>
  <div class="flex flex-row items-center justify-between mb-4 gap-x-5">
    <div class="flex w-1/4">
      <a-input-search
        placeholder="Search API..."
        style="width: 300px"
        v-model:value="searchText"
        @change="handleSearch"
        allowClear="true"
      />
    </div>
    <a-button type="primary" class="rounded-md" @click="showAPIKeyModal">Create New API</a-button>
  </div>
  <div class="py-6">
    <ErrorView v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"></ErrorView>
    <a-table
      :tableLayout="'fixed'"
      id="apiKeysList"
      :pagination="{ pageSize: 7 }"
      :dataSource="apiList"
      :columns="columns"
      :rowKey="(key) => key.id"
      @change="handleTableChange"
      :loading="
      [STATES.PENDING].includes(state)
    "
    >
      <template #name="{ text: key }">
        <div class="flex items-center align-middle">
          <div class="truncate">
            <div class="truncate">{{ key.name }}</div>
            <p class="mb-0 text-gray-400">{{ timeAgo(key.created_at) }} ago</p>
          </div>
        </div>
      </template>
      <template #createdBy="{ text: key }">
        <div
          class="truncate cursor-pointer"
          @click="()=>handleClickUser(key.created_by)"
        >{{key.created_by}}</div>
      </template>
      <template #apiKey="{ text: key }">
        <div class="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded text-gray-dark">
          <div>{{ key.code.slice(key.code.length - 22) }}</div>
        </div>
      </template>
      <template #actions="{ text: key }">
        <a-button-group>
          <a-tooltip placement="bottom">
            <template #title>
              <span>Copy API Key</span>
            </template>
            <a-button
              size="small"
              @click="copyAPI(key)"
              class="mr-3.5 rounded"
              :diasbled="key.created_by !== currentUserId"
            >
              <fa icon="fal copy"></fa>
            </a-button>
          </a-tooltip>

          <a-tooltip :diasbled="key.created_by !== currentUserId" placement="bottom">
            <template #title>
              <span>Delete API Key</span>
            </template>
            <a-button
              size="small"
              class="rounded"
              @click="deleteAPI(key.id)"
              :diasbled="key.created_by !== currentUserId"
            >
              <fa icon="fal trash-alt" class="text-red-600"></fa>
            </a-button>
          </a-tooltip>
        </a-button-group>
      </template>
    </a-table>
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
  data() {
    return {
      columns: [
        {
          title: "Name",
          key: "name",
          width: 200,
          slots: { customRender: "name" },
        },
        {
          title: "Created By",
          key: "created_by",
          width: 150,
          slots: { customRender: "createdBy" },
        },
        {
          title: "API Key",
          width: 120,
          slots: { customRender: "apiKey" },
        },
        {
          width: 100,
          title: "Actions",
          slots: { customRender: "actions" },
        },
      ],
    };
  },
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

<style lang="less">
@import "~/styles/admin-page-table.less";
</style>
