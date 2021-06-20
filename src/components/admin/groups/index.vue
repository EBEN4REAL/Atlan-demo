<template>
  <div>
    <div class="flex justify-between my-3">
      <div class="flex w-1/2">
        <a-input-search
          placeholder="Search Groups"
          :allowClear="true"
          class="mr-1"
          v-model:value="searchText"
          @change="onSearch"
        ></a-input-search>
      </div>
      <a-button @click="toggleAddGroupModal">New Group</a-button>
    </div>
    <div
      class="flex items-center h-full align-middle bg-white"
      style="min-height: 200px"
      v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
    >
      <ErrorView></ErrorView>
    </div>
    <a-table
      v-else-if="groupList && groupList.length"
      :dataSource="groupList"
      :columns="columns"
      :row-key="(group) => group.id"
      :pagination="pagination"
      @change="handleTableChange"
      :loading="[STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)"
    >
      <template #name="{text:group}">
        <div @click="() => {handleGroupClick(group)}">
          <span class="capitalize">{{ group.name }}</span>
          <p>{{ group.description }}</p>
        </div>
      </template>

      <!-- <template v-slot="actions">...</template> -->

      <template #actions="{text:group}">
        <a-popover trigger="click" placement="bottom">
          <template #content>
            <span class="flex items-center text-red-600">
              <fa icon="fal trash-alt"></fa>
              <span class="ml-2" @click="()=>handleDeleteGroup(group.id)">Delete</span>
            </span>
          </template>
          <fa icon="fal cog"></fa>
        </a-popover>
      </template>
    </a-table>
    <a-modal
      v-model:visible="isAddGroupModalVisible"
      class="addGroupModal"
      title="Create New Group"
      :footer="null"
      :destroy-on-close="true"
    >
      <AddGroup @createGroup="handleCreateGroup" />
    </a-modal>
    <GroupPreviewDrawer
      @closePreview="handleClosePreview"
      :selectedGroup="selectedGroup"
      :showGroupPreview="showGroupPreview"
      @refreshTable="getGroupList"
    />
  </div>
</template>
<script lang="ts">
import { ref, reactive, defineComponent, computed } from "vue";
import useGroups from "~/composables/group/useGroups";
import AddGroup from "./addGroup.vue";
import ErrorView from "@common/error/index.vue";
import GroupPreviewDrawer from "./groupPreview/groupPreviewDrawer.vue";
import { Group } from "~/api/auth/group";
import { message } from "ant-design-vue";
export default defineComponent({
  components: {
    AddGroup,
    ErrorView,
    GroupPreviewDrawer,
  },
  setup(props, context) {
    const isAddGroupModalVisible = ref(false);
    const showGroupPreview = ref(false);
    const toggleAddGroupModal = () => {
      isAddGroupModalVisible.value = !isAddGroupModalVisible.value;
    };
    let selectedGroupId = ref("");
    const groupListAPIParams = reactive({
      limit: 6,
      offset: 0,
      sort: "-created_at",
      filter: {},
    });
    const pagination = computed(() => {
      return {
        total: Object.keys(groupListAPIParams.filter).length
          ? filteredGroupsCount.value
          : totalGroupsCount.value,
        pageSize: groupListAPIParams.limit,
        current: groupListAPIParams.offset / groupListAPIParams.limit + 1,
      };
    });
    const {
      groupList,
      totalGroupsCount,
      filteredGroupsCount,
      getGroupList,
      state,
      STATES,
    } = useGroups(groupListAPIParams);
    //Logic for search input
    const searchText = ref<string>("");
    const onSearch = (searchValue: string) => {
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
    };
    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
      //add sort
      if (Object.keys(sorter).length) {
        let sortValue = "-created_at";
        if (sorter.order && sorter.column && sorter.column.sortKey)
          sortValue = `${sorter.order === "descend" ? "-" : ""}${
            sorter.column.sortKey
          }`;
        groupListAPIParams.sort = sortValue;
        groupListAPIParams.offset = 0;
      }
      //modify offset
      const offset = (pagination.current - 1) * groupListAPIParams.limit;
      groupListAPIParams.offset = offset;
      // fetch groups
      getGroupList();
    };
    const handleGroupClick = (group: any) => {
      showGroupPreview.value = true;
      selectedGroupId.value = group.id;
    };
    const selectedGroup = computed(() => {
      let activeGroupObj = {};
      if (groupList && groupList.value && groupList.value.length)
        activeGroupObj = groupList.value.find(
          (group: any) => group.id === selectedGroupId.value
        );
      return activeGroupObj;
    });
    const handleClosePreview = () => {
      showGroupPreview.value = false;
    };
    const handleDeleteGroup = async (groupId: string) => {
      try {
        await Group.DeleteGroup(groupId);
        getGroupList();
        message.success("Group Removed");
      } catch (error) {
        message.error("Failed, try again");
      }
    };
    const handleCreateGroup = () => {
      isAddGroupModalVisible.value = false;
      getGroupList();
    };
    return {
      isAddGroupModalVisible,
      toggleAddGroupModal,
      searchText,
      onSearch,
      groupList,
      pagination,
      handleTableChange,
      state,
      STATES,
      handleGroupClick,
      showGroupPreview,
      totalGroupsCount,
      selectedGroup,
      handleClosePreview,
      handleDeleteGroup,
      handleCreateGroup,
      getGroupList,
    };
  },
  data() {
    return {
      dataSource: [],
      columns: [
        {
          title: "Group Name",
          key: "name",
          sorter: true,
          ellipsis: true,
          sortKey: "alias",
          slots: { title: "customTitle", customRender: "name" },
        },
        {
          title: "Created By",
          dataIndex: "createdBy",
          key: "createdBy",
        },
        {
          title: "Created",
          dataIndex: "createdAtTimeAgo",
          key: "createdAt",
          sorter: true,
          ellipsis: true,
          sortKey: "created_at",
        },
        {
          title: "Members",
          dataIndex: "memberCountString",
          key: "memberCountString",
          sorter: true,
          ellipsis: true,
          sortKey: "user_count",
        },
        {
          title: "Actions",
          slots: { customRender: "actions" },
        },
      ],
    };
  },
  methods: {},
});
</script>