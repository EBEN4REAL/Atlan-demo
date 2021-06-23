


<template>
  <Checkbox :list="List" @change="handleChange"></Checkbox>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import { List } from "~/constant/status";
import Checkbox from "@common/checkbox/index.vue";

export default defineComponent({
  name: "StatusCheckbox",
  components: {
    Checkbox,
  },
  props: {},
  data() {
    return {
      List,
      selected: [],
    };
  },
  emits: ["change"],
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
  