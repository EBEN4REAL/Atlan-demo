<template>
  <div>
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
      <a-button @click="$emit('showUserGroups')">
        <fa icon="fal chevron-left" />
      </a-button>
      <a-button @click="$emit('addUserToGroups')" type="primary" :disabled="addToGroupLoading">
        <fa icon="fal plus" class="mr-2" />Add
      </a-button>
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
        @click="()=>{getGroupList()}"
      >Try again</a-button>
    </div>
    <div v-else class="mt-4 overflow-auto">
      <a-checkbox-group v-model:value="selectedIds" @change="handleChange" class="w-full">
        <div class="flex flex-col w-full">
          <template v-for="group in groupList.value" :key="group.id">
            <a-checkbox :value="group.id" class="flex items-center w-full">
              <div class="flex justify-between mb-2">
                <div class="flex items-center">
                  <a-avatar
                    shape="circle"
                    class="mr-1 ant-tag-blue text-primary-500 avatars"
                  >{{ getNameInitials(getNameInTitleCase(group.name)) }}</a-avatar>
                  <div class="ml-2">
                    <div>{{ group.name }}</div>
                    <div class="text-xs">@{{ group.alias }}</div>
                    <div class="text-xs">{{ group.memberCountString }}</div>
                  </div>
                </div>
              </div>
            </a-checkbox>
          </template>
        </div>
      </a-checkbox-group>
      <div
        class="flex justify-center"
        v-if="[STATES.PENDING].includes(state) ||
              [STATES.VALIDATING].includes(state)"
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
import useGroups from "~/composables/group/useGroups";

export default defineComponent({
  name: "Groups",
  components: {
    ErrorView,
  },
  props: {
    addToGroupLoading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    const selectedIds = ref([]);
    const searchText = ref("");
    const groupListAPIParams = reactive({
      limit: 10,
      offset: 0,
      sort: "name",
      filter: {},
    });
    const {
      groupListConcatenated: groupList,
      totalGroupsCount,
      filteredGroupsCount,
      getGroupList,
      state,
      STATES,
    } = useGroups(groupListAPIParams);

    const handleSearch = useDebounceFn((input: any) => {
      groupListAPIParams.filter = searchText.value
        ? {
            $or: [
              { name: { $ilike: `%${searchText.value}%` } },
              { alias: { $ilike: `%${searchText.value}%` } },
            ],
          }
        : {};
      groupListAPIParams.offset = 0;
      getGroupList();
    }, 200);
    const handleLoadMore = () => {
      groupListAPIParams.offset =
        groupListAPIParams.offset + groupListAPIParams.limit;
      getGroupList();
    };
    let showLoadMore = computed(() => {
      return getIsLoadMore(
        // TODO: check if there's a better way access memberList and not use ref in a ref
        groupList.value.value.length,
        groupListAPIParams.offset,
        groupListAPIParams.limit,
        searchText.value ? filteredGroupsCount.value : totalGroupsCount.value
      );
    });
    const handleChange = () => {
      context.emit("updateSelectedGroups", selectedIds.value);
    };
    return {
      searchText,
      showLoadMore,
      groupList,
      totalGroupsCount,
      filteredGroupsCount,
      getGroupList,
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
    
    <style>
</style>