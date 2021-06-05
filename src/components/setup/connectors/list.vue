<template>
  <div class="flex justify-between w-full mb-5">
    <a-input-search
    size="large"
    class="mr-4"
    placeholder="Search Connectors"
    v-model:value="searchText"
    @change="handleSearch"
  ></a-input-search>
    <CategorySelector style="min-width: 200px;" size="large" v-model:value="category"></CategorySelector>
   
  </div>
  <div class="flex items-center space-x-2 align-middle">
    <template v-for="item in list" :key="item.guid">
      <ItemView :item="item" @click="handleSelect(item)"></ItemView>
    </template>
  </div>
</template>
            
<script lang="ts">
import { ActionTypes as ConnectorActionTypes } from "~/store/modules/connector/types-action";
import { defineComponent } from "vue";
import { useStore } from "~/store";
import ItemView from "./item.vue";
import CategorySelector  from "@common/selector/category/index.vue";

import SearchMixin  from "~/mixins/search";

export default defineComponent({
  mixins: [SearchMixin],
  components: {
    ItemView,
    CategorySelector,
  },
  data() {
    return {
      searchText: "",
      category: "",
      list: [],
    }
  },
  computed: {
    list() {
      const store = useStore();
      return store.getters.getConnectorList;
    },
  },
  emits: ["select"],
  mounted() {
    const store = useStore();
    store.dispatch(ConnectorActionTypes.CONNECTOR_FETCH_LIST);
  },
  methods: {
    getFiltered() {

    },
    handleSelect(item) {
      this.$emit("select", item);
    },
    handleSearch() {
      console.log()
    }
  },
});
</script>