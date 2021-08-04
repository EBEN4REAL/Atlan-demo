


<template>
  <Checkbox :list="List" @change="handleChange"></Checkbox>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import Checkbox from "@common/checkbox/index.vue";
import { List } from "~/constant/status";

export default defineComponent({
  name: "StatusCheckbox",
  components: {
    Checkbox,
  },
  props: {},
  emits: ["change"],
  data() {
    return {
      List,
      selected: [],
    };
  },
  mounted() {},
  methods: {
    handleChange(value: any) {
      this.$emit("change", value);
    },
  },
});
</script>
  

  
<style lang="less" module>
</style>
  