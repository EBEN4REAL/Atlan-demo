<template>
  <router-view></router-view>
</template>
    
    
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  components: {},
  data() {
    return {
      selected: {},
    };
  },
  mounted() {},
  methods: {},
});
</script>
    
  <style lang="less" module>
</style>
        
    
    <route lang="yaml">
    meta:
      layout: default
      requiresAuth: true
    </route>