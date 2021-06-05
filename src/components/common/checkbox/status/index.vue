


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
.sidebartab {
  :global(.ant-tabs-tab) {
    @apply text-primary-200 !important;
    padding: 8px 12px !important;
    max-width: 60px !important;
    //   min-height: 48px !important;
    //   line-height: 40px;
  }
  :global(.ant-tabs-ink-bar) {
    @apply bg-primary-200;
    right: 0px !important;
    border-top-right-radius: 1px !important;
    border-bottom-right-radius: 1px !important;
    width: 0px !important;
    right: auto !important;
  }
  :global(.ant-tabs-left-bar) {
    border: 0px !important;
    min-width: 60px !important;
  }
  :global(.ant-tabs-nav-container) {
    margin-right: 0px !important;
  }

  :global(.ant-tabs-nav-wrap) {
    margin-right: 0px !important;
  }
  :global(.ant-tabs-tab-active) {
    @apply bg-gray-100 bg-opacity-10 text-white !important;
    transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
}
</style>
  