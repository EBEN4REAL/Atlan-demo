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
    <template #suffix>
      <a-spin size="small" v-if="loading" class="ml-1"></a-spin>
    </template>
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
    loading: {
      type: Boolean,
      required: false,
      default() {
        return true;
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
</style>>
