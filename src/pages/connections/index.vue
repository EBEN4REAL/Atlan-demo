<template>
  <splitpanes class="h-full default-theme">
    <pane min-size="25" max-size="50" size="25" class="p-3 bg-white">
      <p class="mb-2 text-2xl font-medium tracking-tight">Connections</p>
      <div class="flex">
        <a-input-search
          placeholder="Search.."
          v-model:value="searchText"
        ></a-input-search>
        <a-button type="primary" class="ml-2" @click="handleNewConnector">
          <fa icon="fal plus"></fa>
        </a-button>
      </div>
      <div class="mt-2" v-if="loading">
        <Loading></Loading>
      </div>
      <div class="mt-2" v-else-if="!loading && error">
        <ErrorView :error="error"></ErrorView>
      </div>
      <div class="mt-2" v-else>
        <ConnectionTree :searchText="searchText"></ConnectionTree>
      </div>
    </pane>
    <pane size="74">
      <div class="flex flex-col h-full p-4">
        <RunList></RunList>
        <div
          class="flex items-center justify-center w-full px-5 py-4 border-b border-gray-100  bg-gray-50"
        ></div>
      </div>
    </pane>
  </splitpanes>
</template>
      
      
<script lang="ts">
import { defineComponent } from "vue";
import ConnectionTree from "@common/tree/connection/index.vue";
import Loading from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";

import RunList from "@/connection/widget/list.vue";
import { useStore } from "~/store";

export default defineComponent({
  name: "HelloWorld",
  components: { ConnectionTree, RunList, Loading, ErrorView },
  data() {
    return {
      selected: {},
      searchText: "",
    };
  },
  mounted() {},
  computed: {
    loading() {
      const store = useStore();
      return store.getters.getConnectionStatus.loading;
    },
    error() {
      const store = useStore();
      return store.getters.getConnectionStatus.error;
    },
  },
  methods: {
    handleNewConnector() {
      this.$router.push("/connections/new");
    },
  },
});
</script>
      
      
<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>