<template>
  <div class="w-full">
    <p class="mb-2 text-xs font-semibold leading-tight text-gray-500 uppercase">
      Last Refresh
    </p>
    <div class="" v-if="isLoading || isValidating">
      <a-spin size="small"></a-spin>
    </div>
    <div class="" v-else-if="data?.items === null">N/A</div>
    <div
      class="flex flex-col"
      v-for="item in data?.items"
      :key="item.name"
      v-else
    >
      <!-- {{ item }} -->
      <div class="flex">
        <a-spin v-if="item?.status?.phase == 'Running'" class="mr-2"></a-spin>
        <fa
          icon="fas check-circle"
          style="display: inline-block; vertical-align: middle"
          class="mr-1 text-xl text-green-500"
          v-if="item?.status?.phase == 'Succeeded'"
        ></fa>
        <fa
          icon="fas exclamation-triangle"
          class="inline-block mr-1 text-xl text-red-500 align-middle"
          v-else-if="item?.status?.phase == 'Failed'"
        ></fa>

        {{ item?.status?.phase }}
      </div>
      <div class="mt-2 text-gray-500">
        <span v-if="finishedAt(item, true)"
          >{{ finishedAt(item, true) }} ago</span
        >
      </div>
      <div class="text-sm text-gray-500">
        {{ duration(item) }}
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, PropType, reactive, ref, watch } from "vue";
import { ConnectionType } from "~/types/atlas/connection";
import { BotsType } from "~/types/atlas/bots";
import { CredentialType } from "~/types/atlas/credential";
import useWorkflowList from "~/composables/bots/useWorkflowList";
import WorkflowMixin from "~/mixins/workflow";

export default defineComponent({
  components: {},
  mixins: [WorkflowMixin],
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
  mounted() {},
  data() {
    return {
      list: [],
    };
  },
  setup(props) {
    const now = ref(true);
    let params = reactive({
      "listOptions.limit": 20,
      "listOptions.labelSelector": `connection-guid=${props.item.guid},category=metadata`,
    });
    const { data, refresh, replaceParams, isLoading, isValidating } =
      useWorkflowList(now, params, "");

    watch(
      () => props.item.guid,
      () => {
        params = {
          "listOptions.limit": 20,
          "listOptions.labelSelector": `connection-guid=${props.item.guid},category=metadata`,
        };
        replaceParams({
          "listOptions.limit": 20,
          "listOptions.labelSelector": `connection-guid=${props.item.guid},category=metadata`,
        });
        refresh();
      }
    );

    return {
      data,
      replaceParams,
      isLoading,
      isValidating,
    };
  },
});
</script>