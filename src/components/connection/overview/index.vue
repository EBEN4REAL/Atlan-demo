


<template>
  <div class="p-6">
    <DetailsView
      :item="item"
      :credential="credential"
      :bot="bot"
      class="mb-3"
    ></DetailsView>
    <div class="flex justify-between mt-4">
      <p class="mb-0 text-gray-400">Last 5 runs</p>
      <p class="mb-0 cursor-pointer text-primary-500">View All</p>
    </div>

    <RunsView :item="item" :credential="credential" :bot="bot"></RunsView>
    <div class="flex justify-between mt-3">
      <p class="mb-0 text-gray-400">Query Configuration</p>
    </div>
    <div class="grid grid-cols-12 mt-3">
      <div class="col-span-6">
        <QueryView class="" :item="item"></QueryView>
      </div>
    </div>
  </div>
</template>
        
<script lang="ts">
import { defineComponent, PropType } from "vue";

import RunsView from "@common/list/runs/index.vue";

import DetailsView from "@/connection/overview/details.vue";
import QueryView from "@/connection/overview/query.vue";
import { ConnectionType } from "~/types/atlas/connection";
import { CredentialType } from "~/types/atlas/credential";
import { BotsType } from "~/types/atlas/bots";

export default defineComponent({
  name: "HelloWorld",
  components: { DetailsView, QueryView, RunsView },
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
  data() {
    return {};
  },
});
</script>
        
        
<style lang="less" module>
</style>
        