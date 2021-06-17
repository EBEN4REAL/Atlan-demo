<template>
  <div class="px-3">
    <div class="flex items-center justify-between align-middle">
      <p class="mb-1 text-gray-500">Connector</p>
      <a-popover placement="bottom" trigger="click">
        <template #content>
          <p class="mb-2 text-gray-500">Connector</p>
          <ConnectorSelector
            v-model:value="connector"
            mode="multiple"
            :maxTagCount="2"
            :maxTagTextLength="10"
            style="width: 200px"
            placeholder="All Connectors"
            @change="handleConnectorChange"
          ></ConnectorSelector>
          <p class="mt-2 mb-1 text-gray-500">Connections</p>
          <ConnectionSelector
            v-model:value="connection"
            :disabled="isDisabled"
            mode="multiple"
            :maxTagCount="2"
            :maxTagTextLength="10"
            style="width: 200px"
            placeholder="All Connections"
          ></ConnectionSelector>
        </template>
        <p class="mb-0 text-xs text-primary-500">edit</p>
      </a-popover>
    </div>
  </div>
  <div class="px-3" v-if="connector.length > 0">
    <template v-for="item in connector" :key="item">
      <div
        class="flex items-center justify-between text-base tracking-wide text-gray-900 uppercase align-middle "
      >
        <div class="flex items-center align-middle">
          <img :src="logo(item)" class="w-auto h-5 mr-1" />
          <span>{{ item }}</span>
        </div>
        <div class="text-xs text-gray-400" v-if="connection.length > 0">
          ({{ connection.length }})
        </div>
      </div>
    </template>
  </div>
  <template v-else>
    <p
      class="flex items-center px-3 mb-0 text-sm tracking-wide text-gray-900 align-middle "
    >
      <fa icon="fal globe" class="mr-1"></fa>All Connectors
    </p>
  </template>
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
  setup() {
    let connector = ref([]);
    let connection = ref([]);

    const isDisabled = computed(() => {
      if (connector.value.length > 0) {
        return false;
      }
      return true;
    });

    const handleConnectorChange = (value) => {
      console.log(value);
    };
    return {
      connector,
      connection,
      isDisabled,
      handleConnectorChange,
    };
  },
  computed: {},
  mounted() {},
  methods: {},
});
</script>