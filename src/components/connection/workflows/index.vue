<template>
  <div class="flex h-full">
    <a-collapse v-model:activeKey="activeKey" class="w-full bg-transparent">
      <a-collapse-panel
        key="1"
        header="This is panel header 1"
        class="bg-transparent"
      >
        <p>asdsad</p>
      </a-collapse-panel>
      <a-collapse-panel
        key="2"
        header="This is panel header 2"
        :disabled="false"
        class="bg-transparent"
      >
        <p>asdsad</p>
      </a-collapse-panel>
      <a-collapse-panel
        key="3"
        header="This is panel header 3"
        class="bg-transparent"
      >
        <p>v</p>
      </a-collapse-panel>
    </a-collapse>
    <!-- <div class="flex flex-col w-1/4 h-full overflow-hidden border-r bg-gray-50">
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
import { defineComponent, PropType, ref } from "vue";
import { BotsType } from "~/types/atlas/bots";
import { ConnectionType } from "~/types/atlas/connection";
import { CredentialType } from "~/types/atlas/credential";
import fetchBotsList from "~/composables/bots/fetchBotsList";

import Assets from "./assets.vue";
import { Components } from "~/api/auth/atlas";

export default defineComponent({
  name: "HelloWorld",
  components: { Assets },
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
    let now = ref(true);
    const activeKey = ref(["1"]);

    const entityFilters = {
      condition: "AND",
      criterion: [
        {
          operator: <Components.Schemas.Operator>"eq",
          attributeName: "integrationName",
          attributeValue: props.item?.attributes?.integrationName,
        },
      ],
    };
    const { list } = fetchBotsList(now, "", entityFilters);
    return {
      list,
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
          