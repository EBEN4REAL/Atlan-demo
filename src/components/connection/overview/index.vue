


<template>
  <div class="p-6">
    <DetailsView :item="item" :credential="credential" :bot="bot"></DetailsView>
  </div>
</template>
        
<script lang="ts">
import { defineComponent, PropType } from "vue";

import DetailsView from "@/connection/overview/details.vue";
import { ConnectionType } from "~/types/atlas/connection";
import { CredentialType } from "~/types/atlas/credential";
import { BotsType } from "~/types/atlas/bots";

export default defineComponent({
  name: "HelloWorld",
  components: { DetailsView },
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
        