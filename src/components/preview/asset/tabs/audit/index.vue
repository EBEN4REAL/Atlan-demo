
<template>
  Audits: {{ audit }} {{guid}}
</template>
          
<script lang="ts">
import { toRefs } from "vue";
import { defineComponent } from "vue";

import useAssetAudit from "~/composables/asset/useAssetAudit";

export default defineComponent({
  props: {
    guid: {
      type: String,
      required: true,
      default: "",
    },
  },
  setup(props: any) {
    const { guid } = toRefs(props);
    const { audit, error, isLoading } = useAssetAudit(guid.value);
    return { audit, guid, error, isLoading };
  },
});
</script>


   
<style lang="less" module>
</style>
        