<template>
  <splitpanes class="h-full">
    <pane min-size="25" max-size="50" size="25" class="p-3 bg-white border-r">
      <div class="flex flex-col h-full">
        <div>
          <p class="mb-2 text-2xl font-medium tracking-tight">Connections</p>
          <div class="flex">
            <a-input-search
              placeholder="Search.."
              v-model:value="searchText"
            ></a-input-search>
            <a-button type="primary" class="ml-2" @click="handleNewConnector">
              <fa icon="fal plus" class="mr-1"></fa>New
            </a-button>
          </div>
        </div>
        <div class="flex-grow mt-2 overflow-y-auto">
          <ConnectionTree
            :searchText="searchText"
            @select="handleSelect"
          ></ConnectionTree>
        </div>
      </div>
    </pane>
    <pane size="74">
      <router-view></router-view>
    </pane>
  </splitpanes>
</template>
      
      
<script lang="ts">
import { defineComponent } from "vue";
import ConnectionTree from "@/connection/tree/index.vue";
import Loading from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";

export default defineComponent({
  name: "HelloWorld",
  components: { ConnectionTree, Loading, ErrorView },
  data() {
    return {
      selected: {},
      searchText: "",
    };
  },
  mounted() {},
  computed: {
    // loading() {
    //   const store = useStore();
    //   return store.getters.getConnectionStatus.loading;
    // },
    // error() {
    //   const store = useStore();
    //   return store.getters.getConnectionStatus.error;
    // },
  },
  methods: {
    handleNewConnector() {
      this.$router.push("/setup");
    },
    handleSelect(key) {
      this.$router.push(`/connections/${key}`);
    },
  },
});
</script>
      
      
<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>