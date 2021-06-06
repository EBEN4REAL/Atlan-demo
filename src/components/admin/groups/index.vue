<template>
  <div class="flex justify-between my-3">
    <div class="flex w-1/2">
      <a-input-search
        placeholder="Search Groups"
        allowClear="true"
        class="mr-1"
        v-model:value="searchText"
        @change="onSearch"
      ></a-input-search>
      <a-button>Filter</a-button>
    </div>
    <a-button>New Group</a-button>
  </div>
  <a-table
    :dataSource="groupList.data.records"
    :columns="columns"
    :rowKey="groupList.data.records.id"
    v-if="groupList"
  />
</template>
<script lang="ts">
import { ref, reactive, defineComponent } from "vue";
import { GroupApi } from "~/api/auth/group";

export default defineComponent({
  setup(props, context) {
    const groupListAPIParams = reactive({
      limit: 6,
      offset: 0,
      sort: "-created_at",
      filter: {},
    });

    //Function to make API call
    const { data: groupList, mutate: getGroupList } = GroupApi.listGroup(
      groupListAPIParams,
      {}
    );

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