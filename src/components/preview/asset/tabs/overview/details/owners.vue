<template>
  <div>
    <a-popover
      placement="left"
      v-model:visible="isCompleted"
      overlayClassName="inlinepopover"
      trigger="click"
    >
      <template #content>
        <div class="flex flex-col" style="width: 300px; height: 250px">
          <div class="flex items-center align-middle border-b border-gray-100">
            <div class="w-full">
              <a-input
                ref="inputSearch"
                :class="$style.borderless"
                placeholder="Search.."
                :allowClear="true"
                v-model:value="searchText"
                @input="handleSearch"
              >
                <template #suffix>
                  <a-radio-group
                    size="small"
                    v-model:value="ownerType"
                    @change="handleOwnerTypeChange"
                  >
                    <a-radio-button size="small" value="user">
                      <fa icon="fal user" class="leading-none pushtop"></fa>
                    </a-radio-button>
                    <a-radio-button size="small" value="group">
                      <fa icon="fal user-friends" class="pushtop"></fa>
                    </a-radio-button>
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
                  >{{ item.first_name }} {{ item.last_name }}</a-checkbox>
                </div>
              </a-checkbox-group>
              <p
                class="mt-1 mb-0 text-xs text-gray-500"
              >Showing {{ list?.length || 0 }} of {{ total }} Users</p>
            </div>
            <div v-if="ownerType == 'group'">
              <a-checkbox-group v-model:value="ownerGroups">
                <div class="flex flex-col w-full space-y-1">
                  <a-checkbox
                    v-for="item in listGroup"
                    :key="item.name"
                    :value="item.name"
                  >{{ item.name }}</a-checkbox>
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
          <a-button type="primary" size="small" @click="handleUpdate" :loading="isLoading">Update</a-button>
        </div>
      </template>
      <div
        class="px-2 py-1 transition duration-500 ease-in-out rounded-lg hover:bg-gray-50 hover:border"
      >
        <p class="mb-1 text-sm tracking-wide text-gray-400">Owners</p>
        <div class="flex flex-wrap gap-x-1">
          <template v-for="user in item?.attributes?.ownerUsers?.split(',')" :key="user">
            <div
              class="flex items-center px-2 py-1 mb-1 leading-none text-blue-500 align-middle transition-all bg-blue-500 rounded-md cursor-pointer bg-opacity-10 hover:bg-opacity-100 hover:text-white"
              @click.prevent.stop="()=>handleClickUser(user)"
            >
              <fa icon="fal user" class="mr-1 leading-none pushtop text-shadow"></fa>
              <div class="text-shadow">{{ user }}</div>
            </div>
          </template>
          <template v-for="group in item?.attributes?.ownerGroups?.split(',')" :key="group">
            <div
              class="flex items-center px-2 py-1 mb-1 leading-none text-blue-600 align-middle bg-blue-100 rounded-md cursor-pointer hover:text-primary-500"
              @click.prevent.stop="handleClickGroup"
            >
              <fa icon="fal user-friends" class="mr-1 leading-none pushtop"></fa>
              <div>{{ group }}</div>
            </div>
          </template>
        </div>
        <p
          class="mb-0 text-gray-500"
          v-if="!item?.attributes?.ownerUsers && !item?.attributes?.ownerGroups"
        >No owners assigned</p>
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
import { useUserPreview } from "~/composables/user/showUserPreview";
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
    let now = ref(true);

    let ownerType = ref("user");

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
      update,
      isReady,
      state,
      ownerUsers,
      isCompleted,
      isLoading,
      ownerGroups,
    } = updateOwners(props.item, ownerType);

    const handleUpdate = () => {
      update();
    };

    const handleSearch = (e) => {
      if (ownerType.value === "user") {
        handleUserSearch(e);
      }
      if (ownerType.value === "group") {
        handleGroupSearch(e);
      }
    };

    let searchText = ref("");
    const handleOwnerTypeChange = (e: any) => {
      searchText.value = "";
      handleSearch(searchText.value);
    };
    // user preview drawer
    const { showUserPreview, setUserUniqueAttribute } = useUserPreview();
    const handleClickUser = (username: string) => {
      setUserUniqueAttribute(username, "username");
      showUserPreview({ allowed: ["about"] });
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
      update,
      isLoading,
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
            