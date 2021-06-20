<template>
  <a-popover placement="bottom" trigger="click">
    <template #content>
      <p class="mb-2 text-gray-500">Connector</p>
    </template>
    <p>edit</p>
  </a-popover>
</template>
      
<script lang="ts">
import { defineComponent } from "vue";

import ConnectionSelector from "@common/selector/connections/index.vue";
import ConnectorSelector from "@common/selector/connectors/index.vue";

export default defineComponent({
  components: { ConnectionSelector, ConnectorSelector },
  props: {},
  computed: {},
  mounted() {},
  methods: {},
});
</script>