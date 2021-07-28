<template>
  <div class="w-full border rounded">
    <div
      class="flex justify-between w-full px-4 py-3 rounded-tl-md rounded-tr-md"
    >
      <div class="flex space-x-3">
        <Runstatus
          style="min-width: 100px"
          v-model:value="phase"
          @change="handlePhaseChange"
        ></Runstatus>
        <!-- <WorkflowTypeSelector style="min-width: 150px"></WorkflowTypeSelector> -->
        <ConnectionSelector
          style="min-width: 150px"
          v-model:value="connectionQf"
          :showAll="true"
          @change="handleConnectionChange"
        ></ConnectionSelector>
      </div>
      <a-button @click="handleRefresh"><fa icon="fal sync"></fa></a-button>
    </div>
    <div class="w-full overflow-auto min-h-10">
      <div
        class="flex items-center h-full align-middle bg-white"
        style="min-height: 200px"
        v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
      >
        <ErrorView></ErrorView>
      </div>
      <div
        class="flex items-center h-full align-middle bg-white"
        style="min-height: 200px"
        v-else-if="
          [STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)
        "
      >
        <LoadingView></LoadingView>
      </div>

      <table class="table w-full mx-auto overflow-x-hidden table-report" v-else>
        <tbody class="rounded-md">
          <template v-for="item in data.records" :key="item.uid">
            <ItemView :item="item"></ItemView>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import ItemView from "./item.vue";
import useRunList from "~/composables/bots/useRunList";

import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";

import WorkflowTypeSelector from "@common/selector/workflowtype/index.vue";
import ConnectionSelector from "@common/selector/connections/index.vue";
import Runstatus from "../../selector/runstatus/index.vue";

export default defineComponent({
  components: {
    ItemView,
    ErrorView,
    LoadingView,
    WorkflowTypeSelector,
    ConnectionSelector,
    Runstatus,
  },
  props: {
    isArchived: {
      type: Boolean,
    },
  },
  data() {
    return {
      list: [],
      msgServer: null,
    };
  },
  setup(props) {
    let now = ref(true);
    let params = ref({});

    let connectionQf = ref();
    let phase = ref();

    const urlparam = new URLSearchParams();
    urlparam.append("limit", "10");
    urlparam.append("sort", "-finished_at");
    params.value = urlparam;

    const { data, refresh, state, STATES } = useRunList(
      now,
      params,
      "archived_list"
    );

    const updateLabel = () => {
      const urlparam = new URLSearchParams();
      urlparam.append("limit", "10");
      urlparam.append("sort", "-finished_at");

      // let labels = [];
      if (phase.value) {
        urlparam.append("labels", `workflows.argoproj.io/phase=${phase.value}`);
      }

      if (connectionQf.value) {
        urlparam.append(
          "labels",
          `connection-qualified-name=${connectionQf?.value.replaceAll(
            "/",
            ".."
          )}`
        );
      }

      params.value = urlparam;

      // if (connectionGuid.value) {
      //   labels.push(`connection-guid=${connectionGuid.value}`);
      // }
      // if (botTemplateName.value) {
      //   labels.push(`category=${botTemplateName.value}`);
      // }
      // params.value["listOptions.labelSelector"] = labels.join(",");
    };

    const handlePhaseChange = () => {
      updateLabel();
      refresh();
    };
    const handleConnectionChange = () => {
      updateLabel();
      refresh();
    };
    const handleRefresh = () => {
      refresh();
    };

    return {
      data,
      state,
      STATES,
      phase,
      handleRefresh,
      handlePhaseChange,
      connectionQf,
      handleConnectionChange,
    };
  },
  mounted() {},
});
</script>

<style lang="less" scoped>
.table-report {
  border-spacing: 0 2px;
}
</style>
