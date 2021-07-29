<template>
  <p>Logs {{ status }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useWorkflowLogsStream from "~/composables/bots/useWorkflowLogsStream";

export default defineComponent({
  props: {},
  setup(props) {
    const { initLogs, status } = useWorkflowLogsStream();
    initLogs();
    return {
      initLogs,
      status,
    };
  },
});
</script>

<style scoped></style>
