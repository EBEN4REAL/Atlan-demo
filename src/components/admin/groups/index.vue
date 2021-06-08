<template>
  <div>
    <div class="flex justify-between my-3">
      <div class="flex w-1/2">
        <a-input-search
          placeholder="Search Groups"
          allowClear="true"
          class="mr-1"
          v-model:value="searchText"
          @change="onSearch"
        ></a-input-search>
      </div>
      <a-button @click="toggleAddGroupModal">New Group</a-button>
    </div>
    <a-table
      :dataSource="groupList.data.records"
      :columns="columns"
      :rowKey="groupList.data.records.id"
      v-if="groupList"
    />
    <a-modal
      v-model:visible="isAddGroupModalVisible"
      class="addGroupModal"
      title="Create New Group"
      :footer="null"
    >
      <AddGroup />
    </a-modal>
  </div>
</template>
<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
import useGroups from "./useGroups";
import AddGroup from "./addGroupNew.vue";

export default defineComponent({
  components: {
    AddGroup,
  },
  setup(props, context) {
    const isAddGroupModalVisible = ref(true);
    const toggleAddGroupModal = () => {
      isAddGroupModalVisible.value = !isAddGroupModalVisible.value;
    };

    const groupListAPIParams = reactive({
      limit: 6,
      offset: 0,
      sort: "-created_at",
      filter: {},
    });

    const { groupList, getGroupList } = useGroups(groupListAPIParams);

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
      getGroupList();
    };

    return {
      isAddGroupModalVisible,
      toggleAddGroupModal,
      searchText,
      onSearch,
      groupList,
    };
  },
  data() {
    return {
      dataSource: [],
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          key: "name",
        },
        {
          title: "User",
          dataIndex: "user",
          key: "user",
        },
        {
          title: "Created",
          dataIndex: "attributes.created_at",
          key: "attributes.created_at",
        },
      ],
    };
  },
  methods: {},
});
</script>