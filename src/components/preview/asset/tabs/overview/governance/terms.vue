<template>
  <div>
    <a-popover
      v-model:visible="isCompleted"
      placement="left"
      overlay-class-name="inlinepopover"
      trigger="click"
    >
      <template #content>
        <div class="flex flex-col" style="width: 300px; height: 250px">
          <div class="flex items-center align-middle border-b border-gray-100">
            <div class="w-full">
              <a-input
                ref="inputSearch"
                v-model:value="searchText"
                :class="$style.borderless"
                placeholder="Search.."
                :allow-clear="true"
                @input="handleSearch"
              >
                <template #suffix>
                  <a-radio-group
                    v-model:value="ownerType"
                    size="small"
                    @change="handleOwnerTypeChange"
                  >
                    <a-radio-button size="small" value="user">
                      <fa icon="fal user" class="leading-none pushtop"></fa
                    ></a-radio-button>
                    <a-radio-button size="small" value="group">
                      <fa icon="fal user-friends" class="pushtop"></fa
                    ></a-radio-button>
                  </a-radio-group>
                </template>
              </a-input>
            </div>
          </div>
          <div class="w-full p-2 overflow-auto">
            <div v-if="ownerType == 'user'">
              <a-checkbox-group v-model:value="ownerUsers">
                <div class="flex flex-col w-full space-y-1">
                  <a-checkbox
                    v-for="item in list"
                    :key="item.username"
                    :value="item.username"
                  >
                    {{ item.first_name }} {{ item.last_name }}
                  </a-checkbox>
                </div>
              </a-checkbox-group>
              <p class="mt-1 mb-0 text-xs text-gray-500">
                Showing {{ list?.length || 0 }} of {{ total }} Users
              </p>
            </div>
            <div v-if="ownerType == 'group'">
              <a-checkbox-group v-model:value="ownerGroups">
                <div class="flex flex-col w-full space-y-1">
                  <a-checkbox
                    v-for="item in listGroup"
                    :key="item.name"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </a-checkbox>
                </div>
              </a-checkbox-group>
              <p class="mt-1 mb-0 text-xs text-gray-500">
                Showing {{ listGroup?.length || 0 }} of
                {{ totalGroupCount }} Groups
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-end p-2 space-x-2 border-t border-gray-100">
          <a-button size="small" @click="handleCancel">Cancel</a-button>
          <a-button
            type="primary"
            size="small"
            :loading="!state && isReady"
            @click="handleUpdate"
            >Update</a-button
          >
        </div>
      </template>
      <div
        class="px-2 py-1 transition duration-500 ease-in-out rounded-lg  hover:bg-gray-50 hover:border"
      >
        <p class="mb-1 text-sm tracking-wide text-gray">Business Terms</p>
        <div class="flex flex-wrap gap-x-1">
          <template v-for="meaning in item?.meanings" :key="meaning.termGuid">
            <div
              class="flex items-center px-2 py-1 mb-1 leading-none text-purple-500 align-middle bg-purple-500 rounded-md cursor-pointer  bg-opacity-10 hover:bg-purple-500 hover:text-white drop-shadow-sm"
              @click.prevent.stop="handleClickUser"
            >
              <fa icon="fal tag" class="mr-1 leading-none pushtop"></fa>

              <div class="text-shadow">{{ meaning.displayText }}</div>
            </div>
          </template>
        </div>
        <p
          v-if="!item?.attributes?.ownerUsers && !item?.attributes?.ownerGroups"
          class="mb-0 text-gray-500"
        >
          No terms added
        </p>
      </div>
    </a-popover>
  </div>
</template>
              
<script lang="ts">
import { defineComponent, ref } from "vue";
import StatusBadge from "@common/badge/status/index.vue";

import fetchUserList from "~/composables/user/fetchUserList";
import fetchGroupList from "~/composables/group/fetchGroupList";
import updateOwners from "~/composables/asset/updateOwners";

export default defineComponent({
  components: { StatusBadge },

  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    const now = ref(true);

    const ownerType = ref("user");

    const {
      list,
      total,
      filtered,
      handleSearch: handleUserSearch,
    } = fetchUserList(now);

    const {
      list: listGroup,
      handleSearch: handleGroupSearch,
      total: totalGroupCount,
    } = fetchGroupList(now);

    const {
      handleCancel,
      execute,
      isReady,
      state,
      ownerUsers,
      isCompleted,
      ownerGroups,
    } = updateOwners(props.item, ownerType);

    const handleUpdate = () => {
      execute();
    };

    const handleSearch = (e) => {
      if (ownerType.value === "user") {
        handleUserSearch(e);
      }
      if (ownerType.value === "group") {
        handleGroupSearch(e);
      }
    };

    const searchText = ref("");
    const handleOwnerTypeChange = (e: any) => {
      searchText.value = "";
      handleSearch(searchText.value);
    };

    const handleClickUser = () => {
      alert("user");
    };
    const handleClickGroup = () => {
      alert("group");
    };

    return {
      list,
      isReady,
      total,
      filtered,
      ownerUsers,
      ownerGroups,
      handleSearch,
      ownerType,
      handleUpdate,
      isCompleted,
      handleCancel,
      state,
      listGroup,
      totalGroupCount,
      handleOwnerTypeChange,
      searchText,
      handleClickUser,
      handleClickGroup,
    };
  },
});
</script>
    


<style lang="less" module>
.borderless {
  @apply border-none shadow-none px-4 !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  &:global(.ant-input-affix-wrapper-focused) {
    @apply border-none shadow-none;
  }
}
</style>
            