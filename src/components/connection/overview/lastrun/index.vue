<template>
  <div class="w-full">
    <p class="mb-2 text-xs font-semibold leading-tight text-gray-500 uppercase">
      Last Refresh
    </p>
    <div class="flex" v-for="item in data?.items" :key="item.name">
      <!-- {{ item }} -->
      <div class="flex">
        <a-spin v-if="phase(item) == 'Running'" class="mr-2"></a-spin>
        <fa
          icon="fas check-circle"
          style="display: inline-block; vertical-align: middle"
          class="mr-1 text-xl text-green-500"
          v-if="phase(item) == 'Succeeded'"
        ></fa>
        <fa
          icon="fas exclamation-triangle"
          class="inline-block mr-1 text-xl text-red-500 align-middle"
          v-else-if="phase(item) == 'Failed'"
        ></fa>

        {{ phase(item) }}
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { defineComponent, PropType, ref, watch } from "vue";
import { ConnectionType } from "~/types/atlas/connection";
import { BotsType } from "~/types/atlas/bots";
import { CredentialType } from "~/types/atlas/credential";
import { Workflows } from "~/api/argo/workflow";

import fetchWorkflowList from "~/composables/workflow/fetchWorkflowList";

export default defineComponent({
  components: {},
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
    const now = ref(false);
    const param = ref({});
    param.value = {
      "listOptions.limit": 10,
      "listOptions.labelSelector": `connection-guid=${props.item.guid},category=metadata`,
    };
    const { data, mutate, phase } = fetchWorkflowList(now, param);

    watch(
      () => props.item.guid,
      (newValue, oldValue) => {
        console.log("changed props.");
        now.value = true;
        param.value = {
          "listOptions.limit": 10,
          "listOptions.labelSelector": `connection-guid=${props.item.guid},category=metadata`,
        };

        mutate();
      }
    );

    return {
      data,
      mutate,
      param,
      phase,
    };
  },
});
</script>