<template>
  <splitpanes class="h-full">
    <pane min-size="25" max-size="50" size="25" class="p-4 bg-white border-r">
      <div class="flex flex-col h-full">
        <div>
          <div class="flex">
            <a-input-search placeholder="Search.." v-model:value="searchText">
            </a-input-search>

            <a-button type="primary" class="ml-2" @click="handleNewConnector">
              <fa icon="fal plus" class="mr-1"></fa>New
            </a-button>
          </div>
        </div>
        <div class="flex justify-between my-2">
          <p
            class="mb-0 text-xs font-medium tracking-tight text-gray-500 uppercase "
          >
            Connections
          </p>
        </div>
        <div class="flex-grow overflow-y-auto">
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
import { defineComponent, onMounted } from "vue";
import ConnectionTree from "@/connection/tree/index.vue";
import { useRouter } from "vue-router";
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: { ConnectionTree },
  data() {
    return {
      searchText: "",
    };
  },
  setup() {
    useHead({
      title: "Connections",
    });
    const router = useRouter();
    const handleNewConnector = () => {
      router.push("/setup");
    };
    const handleSelect = (key: any) => {
      router.push(`/connections/${key}`);
    };

    return {
      handleNewConnector,
      handleSelect,
    };
  },
});
</script>

<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>
