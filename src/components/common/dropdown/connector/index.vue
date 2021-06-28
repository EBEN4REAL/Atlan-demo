<template>
  <div class="">
    <div class="">
      <div class="flex flex-col">
        <a-popover placement="right" trigger="click">
          <template #content>
            <p class="mb-0 text-gray-500">Connector</p>
            <ConnectorSelector
              v-model:value="connectors"
              mode="multiple"
              :maxTagCount="2"
              :maxTagTextLength="10"
              style="width: 200px"
              placeholder="All Connectors"
              @change="handleConnectorChange"
            ></ConnectorSelector>
            <p class="mt-2 mb-0 text-gray-500">Connections</p>
            <ConnectionSelector
              v-model:value="connections"
              :disabled="isDisabled"
              mode="multiple"
              :maxTagCount="2"
              :connectors="connectors"
              :maxTagTextLength="10"
              style="width: 200px"
              placeholder="All Connections"
              @change="handleConnectionChange"
            ></ConnectionSelector>
          </template>

          <div
            class="flex flex-col px-3 py-2 border rounded  gap-y-1 hover:bg-gray-50"
            v-if="connectors.length > 0"
          >
            <template v-for="item in connectors" :key="item">
              <div
                class="flex items-center justify-between text-base tracking-wide text-gray-900 align-middle "
              >
                <div class="flex items-center align-middle">
                  <img :src="logo(item)" class="w-auto h-4 mr-1" />
                  <span class="text-sm">{{
                    item?.charAt(0).toUpperCase() +
                    item?.substr(1).toLowerCase()
                  }}</span>
                </div>
              </div>
            </template>
          </div>
          <template v-else>
            <p
              class="flex items-center px-3 py-2 mb-0 text-sm tracking-wide text-gray-900 align-middle border rounded  hover:bg-gray-50"
            >
              <fa icon="fal plug" class="mr-1"></fa>All Connectors
            </p>
          </template>
        </a-popover>
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import ConnectionSelector from "@common/selector/connections/index.vue";
import ConnectorSelector from "@common/selector/connectors/index.vue";
import SourceMixin from "~/mixins/source";

export default defineComponent({
  components: { ConnectionSelector, ConnectorSelector },
  mixins: [SourceMixin],
  props: {},
  emits: ["change"],
  setup(props, { emit }) {
    let connectors = ref([]);
    let connections = ref([]);

    const isDisabled = computed(() => {
      if (connectors.value.length > 0) {
        return false;
      }
      return true;
    });

    const handleConnectorChange = (value) => {
      if (value) {
        connections.value = connections.value.filter((item: string) => {
          return connectors.value.includes(item.split("/")[1]);
        });
      }

      emit("change", {
        connectors: connectors.value,
        connections: connections.value,
      });
    };
    const handleConnectionChange = (value) => {
      console.log(value);
      emit("change", {
        connectors: connectors.value,
        connections: connections.value,
      });
    };
    return {
      connectors,
      connections,
      isDisabled,
      handleConnectorChange,
      handleConnectionChange,
    };
  },
  computed: {},
  mounted() {},
  methods: {},
});
</script>