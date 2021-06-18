<template>
  <div>
    <p>Codemirror</p>
    <Codemirror />
  </div>
</template>
  
<script lang="ts">
import { defineComponent, Ref } from "vue";
import Codemirror from "@/editor/codemirror/index.vue";

export default defineComponent({
  components: {
    Codemirror,
  },
  setup(props, context) {
    return {};
  },
});
</script>
  
<style lang="less">
</style>