<template>
  <div class="flex h-full">
    <div class="w-full p-6">
      <div class="flex items-center justify-between mb-3 align-middle">
        <div>
          <WorkflowTypeSelector style="width: 150px"></WorkflowTypeSelector>
        </div>
        <p class="mb-0 tracking-tight text-gray-500 uppercase">
          Active Workflows
        </p>
        <a-button type="primary">New Workflow</a-button>
      </div>
      <div class="flex flex-col space-y-3">
        <div
          v-for="job in jobList"
          :key="job?.guid"
          class="px-6 py-2 bg-white border rounded"
        >
          job
        </div>
      </div>

      <!-- <a-collapse v-model:activeKey="activeKey" class="w-full bg-transparent">
        <a-collapse-panel
          :header="item?.attributes?.category?.toUpperCase()"
          class="mb-3 bg-white"
          :key="item.guid"
          v-for="item in list"
        >
          <p>asdsad</p>
          <component :is="item?.attributes?.category"></component>
        </a-collapse-panel>
      </a-collapse> -->
    </div>

    <!-- <div class="flex flex-col w-1/4 h-full overflow-hidden border-r bg-gray-100">
      <p class="px-3 pt-6 mb-0 tracking-tight text-gray-500 uppercase">
        Packages
      </p>
      <div class="flex flex-grow w-full px-4 mt-3 mb-2 overflow-y-auto">
        <a-menu mode="inline" :class="$style.sidebar" class="bg-transparent">
          <a-menu-item :key="item.guid" v-for="item in list">
            {{ item?.attributes?.category?.toUpperCase() }}
            <span class="text-yellow-500"><fa icon="fal lock ml-1 "></fa></span>
          </a-menu-item>
        </a-menu>
      </div>
    </div>
    <div class="w-3/4">
      <Assets></Assets>
    </div> -->
  </div>
</template>
          
<script lang="ts">
import { defineAsyncComponent, defineComponent, PropType, ref } from "vue";
import WorkflowTypeSelector from "@common/selector/workflowtype/index.vue";
import { BotsType } from "~/types/atlas/bots";
import { ConnectionType } from "~/types/atlas/connection";
import { CredentialType } from "~/types/atlas/credential";

import fetchJobList from "~/composables/jobs/fetchJobList";

import { Components } from "~/api/auth/atlas";

export default defineComponent({
  name: "HelloWorld",
  components: {
    WorkflowTypeSelector,
    Metadata: defineAsyncComponent(() => import("./metadata.vue")),
    Adoption: defineAsyncComponent(() => import("./adoption.vue")),
  },
  props: {
    item: {
      type: Object as PropType<ConnectionType>,
      required: false,
      default(): any {
        return {};
      },
    },
    credential: {
      type: Object as PropType<CredentialType>,
      required: false,
      default(): any {
        return {};
      },
    },
    bot: {
      type: Object as PropType<BotsType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    const now = ref(true);
    const activeKey = ref(["1"]);

    // const entityFilters = {
    //   condition: "AND",
    //   criterion: [
    //     {
    //       operator: <Components.Schemas.Operator>"eq",
    //       attributeName: "integrationName",
    //       attributeValue: props.item?.attributes?.integrationName,
    //     },
    //   ],
    // };
    // const { list } = fetchBotsList(now, "", entityFilters);

    const entityJobFilters = {
      condition: "AND",
      criterion: [
        {
          operator: <Components.Schemas.Operator>"eq",
          attributeName: "connectionQualifiedName",
          attributeValue: props.item?.attributes?.qualifiedName,
        },
      ],
    };
    const { list: jobList } = fetchJobList(now, "", entityJobFilters);

    return {
      jobList,
      activeKey,
    };
  },
});
</script>
          
          

<style lang="less" module>
.sidebar {
  &:global(.ant-menu-inline) {
    @apply border-none !important;
  }

  :global(.ant-menu-item-group-title) {
    @apply px-0;
  }

  :global(.ant-menu-item) {
    height: 32px;
    line-height: 32px;
  }

  :global(.ant-menu-item::after) {
    @apply border-none !important;
  }

  :global(.ant-menu-item-selected) {
    @apply rounded  !important;
  }
}
</style>
          