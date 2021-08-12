


<template>
  <div class="p-8">
    <DetailsView
      :item="item"
      :credential="credential"
      :bot="bot"
      :loading="loading"
      :syncing="syncing"
    ></DetailsView>
    <!-- <div class="flex justify-between mt-4">
      <p class="mb-0 text-gray">Last 5 runs</p>
      <p class="mb-0 cursor-pointer text-primary">View All</p>
    </div> -->

    <!-- <RunsView :item="item" :credential="credential" :bot="bot"></RunsView> -->

    <DeleteView :key="item.guid" :item="item" class="mt-4"></DeleteView>
  </div>
</template>
        
<script lang="ts">
import { defineComponent, PropType } from "vue";

import RunsView from "@common/list/runs/index.vue";

import DetailsView from "@/connection/overview/details.vue";

import TotalView from "@/connection/overview/analytics/total.vue";
import DeleteView from "@/connection/overview/delete.vue";
import { ConnectionType } from "~/types/atlas/connection";
import { CredentialType } from "~/types/atlas/credential";
import { BotsType } from "~/types/atlas/bots";

export default defineComponent({
  name: "HelloWorld",
  components: { DetailsView, RunsView, DeleteView, TotalView },
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
    loading: {
      type: Boolean,
    },
    syncing: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
});
</script>
        
        
<style lang="less" module>
</style>
        