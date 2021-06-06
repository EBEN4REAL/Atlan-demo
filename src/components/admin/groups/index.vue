<template>
  <div class="flex justify-between my-3">
    <div class="flex w-1/2">
      <a-input-search
        placeholder="Search Groups"
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
    v-if="groupList"
  />
</template>
<script lang="ts">
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { GET_GROUP_LIST } from "~/constant/store_types";

export default {
  setup(props, context) {
    const store = useStore();

    //onLoad make the default API call to populate groupList
    store.dispatch(GET_GROUP_LIST);

    //Logic for search input
    const searchText = ref<string>("");
    const onSearch = (searchValue: string) => {
      store.dispatch(GET_GROUP_LIST, {
        filter: searchText.value
          ? {
              $or: [
                { name: { $ilike: `%${searchText.value}%` } },
                { alias: { $ilike: `%${searchText.value}%` } },
              ],
            }
          : {},
      });
    };

    return {
      searchText,
      onSearch,
      groupList: computed(() => store.state.groups.groupList),
      groupListAPIParams: computed(() => store.state.groups.groupListAPIParams),
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
};
</script>