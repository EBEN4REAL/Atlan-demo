<template>
  <div class="">
    <div class="">
      <div class="flex gap-x-2">
        <a-popover placement="bottomLeft" trigger="click">
          <template #content>
            <p class="mb-0 text-gray-500">Connector</p>
            <ConnectorSelector
              v-model:value="connector"
              style="width: 200px"
              placeholder="All Connectors"
              @change="handleConnectorChange"
            ></ConnectorSelector>
            <p class="mt-2 mb-0 text-gray-500">Connections</p>
            <ConnectionSelector
              v-model:value="connection"
              :disabled="isDisabled"
              :connector="connector"
              style="width: 200px"
              placeholder="All Connections"
              @change="handleConnectionChange"
            ></ConnectionSelector>
          </template>

          <div class="flex px-3 py-2 cursor-pointer" v-if="connector">
            <div class="flex items-center text-xs text-gray-900 align-middle">
              <img :src="getImage(connector)" class="w-auto h-4 mr-1" />

              <fa
                icon="fal chevron-right"
                class="text-xs text-gray-300"
                v-if="connectionObject"
              ></fa>
              <div class="text-xs" v-if="connectionObject">
                {{
                  connectionObject.attributes.displayName ||
                  connectionObject.attributes.name
                }}
              </div>

              <div class="text-xs" v-else-if="connector">
                {{
                  connector?.charAt(0).toUpperCase() +
                  connector?.substr(1).toLowerCase()
                }}
              </div>
              <fa icon="fas caret-down" class="text-primary-500"></fa>
            </div>
            <fa icon="fal chevron-right" class="text-xs text-gray-300"></fa>
          </div>
          <div class="flex px-3 py-2 cursor-pointer" v-else>
            <p
              class="flex items-center mb-0 text-xs tracking-wide text-gray-900 align-middle  hover:bg-gray-50"
            >
              <fa icon="fal plug" class="mr-1"></fa>All Connectors
              <fa icon="fas caret-down" class="text-primary-500"></fa>
            </p>
          </div>
        </a-popover>
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import ConnectionSelector from "@common/selector/connections/index.vue";
import ConnectorSelector from "@common/selector/connectors/index.vue";
import { useConnectionsStore } from "~/pinia/connections";

export default defineComponent({
  components: { ConnectionSelector, ConnectorSelector },

  props: {},
  emits: ["change"],
  setup(props, { emit }) {
    let connector = ref("");
    let connection = ref("");

    const store = useConnectionsStore();
    const getImage = (id: string) => {
      return store.getImage(id);
    };

    const connectionObject = computed(() => {
      return store.getList.find(
        (item) => item.attributes.qualifiedName === connection.value
      );
    });

    const isDisabled = computed(() => {
      if (connector.value?.length > 0) {
        return false;
      }
      return true;
    });

    const handleConnectorChange = (value) => {
      if (!value) {
        connection.value = "";
      } else {
        if (connector.value && connection.value) {
          if (connection?.value.split("/")[0] !== connector.value) {
            connection.value = "";
          }
        }
      }

      emit("change", {
        connectors: connector.value,
        connections: connection.value,
      });
    };
    const handleConnectionChange = (value) => {
      emit("change", {
        connector: connector?.value,
        connection: connection.value,
      });
    };
    return {
      connector,
      connection,
      isDisabled,
      handleConnectorChange,
      handleConnectionChange,
      getImage,
      connectionObject,
    };
  },
  computed: {},
  mounted() {},
  methods: {},
});
</script>