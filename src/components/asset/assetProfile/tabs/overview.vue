<template>
  <div>
    Overview tab
    {{ asset }}
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: ["asset"],
  setup(props) {
    return {
      asset: computed(() => props.asset),
    };
  },
});
</script>
