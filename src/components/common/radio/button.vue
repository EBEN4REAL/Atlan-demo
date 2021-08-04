<template>
  <a-radio-group :value="modelValue" @change="handleChange">
    <template v-for="item in list" :key="item.id">
      <a-radio-button :value="item.id">{{ item.label }}</a-radio-button>
    </template>
  </a-radio-group>
</template>
        
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { CheckboxArray } from "~/types";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: false,
    },
    list: {
      type: Array as PropType<CheckboxArray>,
      required: false,
      default(): CheckboxArray {
        return [];
      },
    },
  },
  emits: ["update:modelValue", "change"],
  computed: {},
  methods: {
    handleChange(e: any) {
      let val = e;
      if (e.target) {
        val = e.target.value;
      }
      this.$emit("update:modelValue", val);
      this.$emit("change", val);
    },
  },
});
</script>
        
        <style lang="less" module>
</style>
        