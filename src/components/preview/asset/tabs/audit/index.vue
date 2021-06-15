
<template>
  Audits:
  {{ audits }}
</template>
          
<script lang="ts">
import { watch } from "vue";
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
    const { audits, error, fetchAudits, isLoading } = useAssetAudit(props.guid);

watch(() => props.guid, (newValue) => {
      fetchAudits(newValue)
})
    return { audits, error, isLoading };
  },
});
</script>


   
<style lang="less" module>
</style>
        