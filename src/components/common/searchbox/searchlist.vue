<template>
  <a-input
    v-model:value="localSearchText"
    :placeholder="placeholder"
    allow-clear
    :size="size"
    autofocus
    :class="$style.searchbox"
    @input="handleInputChange"
  >
  </a-input>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    size: {
      type: String,
      required: false,
      default() {
        return "default";
      },
    },
    placeholder: {
      type: String,
      required: false,
      default() {
        return "Search....";
      },
    },
  },
  data() {
    return {
      localSearchText: "",
    };
  },
  emits: ["change"],
  methods: {
    handleInputChange() {
      this.$emit("change", this.localSearchText);
    },
  },
});
</script>

<style lang="less" module>
.searchbox {
  @apply border-none shadow-none !important;
  &:global(.ant-input-affix-wrapper-focused) {
    @apply border-none shadow-none;
  }
}
</style>>
