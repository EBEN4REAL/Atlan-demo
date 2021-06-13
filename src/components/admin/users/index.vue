<template>
  <div class="flex justify-between my-3">
    <div class="flex w-1/2">
      <a-input-search
        placeholder="Search Members"
        class="mr-1"
        v-model:value="searchText"
        @change="handleSearch"
      ></a-input-search>
    </div>
  </div>
  <a-table
    :dataSource="userList?.records"
    :columns="columns"
    v-if="userList"
    :rowKey="userList?.records.id"
  />
</template>
<script lang="ts">
import { defineComponent, ref, reactive } from "vue";
import { useAPI } from "~/api/useAPI";

export default defineComponent({
  setup() {
    const userListAPIParams = reactive({
      limit: 6,
      filter: {},
    });

    // Make an API
    const { data: userList, mutate: getUserList } = useAPI('LIST_USERS', "GET", {cache: false});
    
    const searchText = ref("");
    const handleSearch = (searchValue: string) => {
      userListAPIParams.filter = searchText.value
        ? {
            $or: searchText.value
              ? [
                  { first_name: { $ilike: `%${searchText.value}%` } },
                  { last_name: { $ilike: `%${searchText.value}%` } },
                  { username: { $ilike: `%${searchText.value}%` } },
                ]
              : [],
          }
        : {};
      getUserList();
    };

    return {
      searchText,
      handleSearch,
      userList,
    };
  },
  data() {
    return {
      dataSource: [],
      columns: [
        {
          title: "Name",
          dataIndex: "first_name",
          key: "name",
        },
        {
          title: "Age",
          dataIndex: "age",
          key: "age",
        },
        {
          title: "Address",
          dataIndex: "address",
          key: "address",
        },
      ],
      loading: false,
      error: null,
      limit: 10,
      offset: 0,
      cancelToken: null,
      searchText: "",
      debounce: undefined,
    };
  },
  mounted() {},
  methods: {
    handleSearch(value: any) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        //this.handleUserFetch(value);
      }, 100);
    },
  },
});
</script>

<style lang="less" module>
</style>