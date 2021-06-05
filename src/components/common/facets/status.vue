


<template>
  <Status @change="handleChange"></Status>
</template>
      
<script lang="ts">
import { defineComponent, PropType } from "vue";
import Status from "@common/checkbox/status/index.vue";
import { Collapse } from "~/types";

export default defineComponent({
  name: "HelloWorld",
  components: {
    Status,
  },
  props: {
    item: {
      type: Object as PropType<Collapse>,
      required: false,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  mounted() {},
  emits: ["change"],
  methods: {
    handleChange(values: any) {
      this.$emit("change", {
        id: this.item.id,
        payload: {
          assetStatus: values,
        },
      });
    },
  },
});
</script>
      
      
      
<style lang="less" module>
</style>
      