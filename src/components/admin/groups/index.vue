<template>
  <div>
    <div class="flex justify-between my-3 gap-x-5">
      <div class="flex w-1/2">
        <a-input-search
          placeholder="Search Groups"
          :allowClear="true"
          class="mr-1"
          v-model:value="searchText"
          @change="onSearch"
        ></a-input-search>
      </div>
      <a-button @click="toggleAddGroupModal" type="primary">New Group</a-button>
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
      :scroll="{ x: '100%' }"
      :loading="
        [STATES.PENDING].includes(state) || [STATES.VALIDATING].includes(state)
      "
    >
      <template #name="{ text: group }">
        <div
          @click="
            () => {
              handleGroupClick(group);
            }
          "
        >
          <div class="text-gray-900 capitalize truncate">{{group.name}}</div>
          <p class="mb-0 text-gray-500 truncate">{{ group.description }}</p>
        </div>
      </template>

      <!-- <template v-slot="actions">...</template> -->

      <template #actions="{ text: group }">
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click="(e) => e.preventDefault()">
            <fa icon="fal cog" />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0" @click="() => handleDeleteGroup(group.id)">
                <fa icon="fal trash-alt" class="mr-2"></fa>Delete
              </a-menu-item>
              <a-menu-item key="1" @click="handleAddMembers(group)">
                <fa icon="fal plus" class="mr-2"></fa>Add Members
              </a-menu-item>
              <a-menu-item key="2" @click="(e)=>{e.stopPropagation();handleToggleDefault(group)}">
                <fa icon="fal plus" class="mr-2"></fa>Mark as default
                <a-spin size="small" v-if="markAsDefaultLoading"></a-spin>
                <!-- <div class="text-xs">New users will be automatically added to default groups</div> -->
              </a-menu-item>
            </a-menu>
            <!-- <span class="flex items-center text-red-600">
              <fa icon="fal trash-alt"></fa>
              <span class="ml-2" @click="() => handleDeleteGroup(group.id)">Delete</span>
            </span>-->
          </template>
          <!-- <fa icon="fal cog"></fa> -->
        </a-dropdown>
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
    <!-- <GroupPreviewDrawer
      @closePreview="handleClosePreview"
      :selectedGroup="selectedGroup"
      :showGroupPreview="showGroupPreview"
      @refreshTable="getGroupList"
      :defaultTab="defaultTab"
    />-->
  </div>
</template>
<script lang="ts">
import { ref, reactive, defineComponent, computed, watch } from "vue";
import useGroups from "~/composables/group/useGroups";
import AddGroup from "./addGroup.vue";
import ErrorView from "@common/error/index.vue";
import GroupPreviewDrawer from "./groupPreview/groupPreviewDrawer.vue";
import { Group } from "~/api/auth/group";
import { message } from "ant-design-vue";
import { useDebounceFn } from "@vueuse/core";
import { useGroupPreview } from "~/composables/drawer/showGroupPreview";
export default defineComponent({
  components: {
    AddGroup,
    ErrorView,
    GroupPreviewDrawer,
  },
  setup(props, context) {
    const isAddGroupModalVisible = ref(false);
    const defaultTab = ref("about");
    const showGroupPreview = ref(false);
    const markAsDefaultLoading = ref(false);
    const toggleAddGroupModal = () => {
      isAddGroupModalVisible.value = !isAddGroupModalVisible.value;
    };
    let selectedGroupId = ref("");
    const groupListAPIParams = reactive({
      limit: 6,
      offset: 0,
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
    const onSearch = useDebounceFn(() => {
      groupListAPIParams.filter = searchText.value
        ? {
            $or: [
              { name: { $ilike: `%${searchText.value}%` } },
              {
                attributes: {
                  $elemMatch: { alias: { $ilike: `%${searchText.value}%` } },
                },
              },
              // { alias: { $ilike: `%${searchText.value}%` } },
            ],
          }
        : {};
      groupListAPIParams.offset = 0;
      getGroupList();
    }, 600);
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
    const handleAddMembers = (group: any) => {
      defaultTab.value = "members";
      handleGroupClick(group);
    };
    const handleGroupClick = (group: any) => {
      // showGroupPreview.value = true;
      showGroupPreviewDrawer(group);
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
      defaultTab.value = "about";
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
    // BEGIN: USER PREVIEW
    const {
      showPreview,
      showGroupPreview: openPreview,
      setGroupUniqueAttribute,
    } = useGroupPreview();
    const showGroupPreviewDrawer = (group: any) => {
      setGroupUniqueAttribute(group.id);
      openPreview();
    };
    watch(showPreview, () => {
      if (!showPreview.value) getGroupList();
    });
    // END: USER PREVIEW
    const handleToggleDefault = (group) => {
      const requestPayload = ref();
      requestPayload.value = {
        name: group.alias,
        alias: group.name,
        attributes: {
          description: [group.description],
          alias: [group.name],
          created_at: [group.createdAt],
          created_by: [group.createdBy],
          image: [group.image],
          isDefault: [`${!group.isDefault}`],
        },
      };
      const { data, isLoading, error } = Group.UpdateGroupV2(
        group.id,
        requestPayload.value
      );
      watch([data, isLoading, error], () => {
        console.log({ data, isLoading, error });
        markAsDefaultLoading.value = isLoading.value;
        if (data.value) {
          message.success("Group marked as default");
        } else if (error.value) {
          markAsDefaultLoading.value = false;
          message.error("Unable to mark group as default, please try again");
        }
      });
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
      handleAddMembers,
      defaultTab,
      handleToggleDefault,
      markAsDefaultLoading,
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
          width: 200,
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