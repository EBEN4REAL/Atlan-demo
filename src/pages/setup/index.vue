<template>
  <splitpanes class="default-theme h-full">
    <pane min-size="25" max-size="50" size="25" class="bg-white p-3">
      <a-input-search placeholder="Search Connections"></a-input-search>
      <div class="mt-2">
        <p class="mb-0 text-gray-400">All Connections</p>
        <ConnectionTree></ConnectionTree>
      </div>
    </pane>
    <pane>
      <div class="flex flex-col h-full p-4">
        <RunList></RunList>
        <div
          class="flex w-full items-center justify-center px-5 py-4 bg-gray-50 border-b border-gray-100"
        >
          <!-- <a-steps size="default" :current="0">
              <a-step title="Connectors" />
              <a-step title="Credential" />
              <a-step title="Configuration" />
            </a-steps> -->
        </div>
      </div>
    </pane>
  </splitpanes>
</template>
      
      
  <script lang="ts">
import { defineComponent } from "vue";
import ConnectionTree from "@common/tree/connection/index.vue";
import RunList from "@/connection/widget/list.vue";

export default defineComponent({
  name: "HelloWorld",
  components: { ConnectionTree, RunList },
  data() {
    return {
      selected: {},
    };
  },
  mounted() {},
  methods: {},
});
</script>
      
    <style lang="less" module>
</style>
          
      
      <route lang="yaml">
      meta:
        layout: default
        requiresAuth: true
      </route>