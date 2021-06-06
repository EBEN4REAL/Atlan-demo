<template>
  <p>Id</p>
</template>
    
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  components: {},
  data() {
    return {};
  },
  setup() {
    return {};
  },
  methods: {
    handlePreview(selectedItem: any) {},
  },
});
</script>
    
<style lang="less" module>
</style>
        
    
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>