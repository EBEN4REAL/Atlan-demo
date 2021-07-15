<template>
  <div class="flex items-center p-4">
    <Readme
      placeholder="Add some details about the Table"
      class="m-h-48"
      parentAssetId="asset.guid"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import Readme from "@/common/readme/index.vue";

export default defineComponent({
  props: ["asset"],
  components: { Readme },
  setup(props) {
    return {
      asset: computed(() => props.asset),
    };
  },
});
</script>
