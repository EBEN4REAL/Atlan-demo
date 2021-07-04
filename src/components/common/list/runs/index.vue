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
        <WorkflowTypeSelector style="min-width: 150px"></WorkflowTypeSelector>
        <ConnectionSelector
          style="min-width: 150px"
          v-model:value="connectionGuid"
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
          <template v-for="item in data.items" :key="item.metadata.uid">
            <ItemView :item="item"></ItemView>
          </template>
        </tbody>
      </table>
    </div>
    <div
      class="flex items-center px-4 py-2 align-middle  bg-gray-50 rounded-bl-md rounded-br-md"
    >
      <!-- <a-button-group class="mr-3">
        <a-button size="small"><fa icon="fal chevron-left"></fa></a-button>
        <a-button size="small"><fa icon="fal chevron-right"></fa></a-button>
      </a-button-group> -->
    </div>
  </div>
</template>
          
<script lang="ts">
import { defineComponent, ref } from "vue";

import ItemView from "./item.vue";
import fetchWorkflowList from "~/composables/workflow/fetchWorkflowList";

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
    let params = ref({}) as { [key: string]: any };

    let connectionGuid = ref("");
    let botTemplateName = ref("");
    let phase = ref("");

    params.value = {
      "listOptions.limit": 50,
      "listOptions.labelSelector": "category=metadata",
    };

    const { data, mutate, state, STATES } = fetchWorkflowList(
      "archived_list",
      now,
      params,
      false
    );

    const updateLabel = () => {
      let labels = [];
      if (phase.value) {
        labels.push(`workflows.argoproj.io/phase=${phase.value}`);
      }
      if (connectionGuid.value) {
        labels.push(`connection-guid=${connectionGuid.value}`);
      }
      if (botTemplateName.value) {
        labels.push(`category=${botTemplateName.value}`);
      }
      params.value["listOptions.labelSelector"] = labels.join(",");
    };

    const handlePhaseChange = () => {
      updateLabel();
      mutate();
    };
    const handleConnectionChange = () => {
      updateLabel();
      mutate();
    };

    return {
      data,
      state,
      STATES,
      phase,
      mutate,
      handlePhaseChange,
      connectionGuid,
      handleConnectionChange,
    };
  },
  mounted() {},
  methods: {
    handleRefresh() {
      this.mutate();
    },
    // async fetchData() {
    //   try {
    //     const response = await Workflows.List({
    //       "listOptions.limit": 10,
    //       "listOptions.labelSelector": "bot-template-name=atlan-jdbc-crawler",
    //     });
    //     this.list = response.items;
    //     this.listenEvents();
    //     console.log(this.list);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
  },
});
</script>

<style lang="less" scoped>
.table-report {
  border-spacing: 0 2px;
  border-collapse: separate;
}
</style>