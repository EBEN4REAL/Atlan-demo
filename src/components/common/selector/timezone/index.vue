<template>
  <a-select
    :value="modelValue"
    :show-search="true"
    :auto-clear-search-value="true"
    :filter-option="false"
    @search="handleSearch"
    @change="handleChange"
  >
    <template v-for="item in list" :key="item.id">
      <a-select-option :value="item.id">
        <div class="flex flex-col">
          <div>{{ item.label }}</div>
          <div class="text-xs text-gray-500">{{ item.id }}</div>
        </div>
      </a-select-option>
    </template>
  </a-select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Select from "@common/selector/index.vue";

import { timezone } from "~/constant/timezone";

export default defineComponent({
  name: "HelloWorld",
  components: {
    Select,
  },
  props: {
    modelValue: {
      type: String,
      required: false,
    },
  },
  emits: ["update:modelValue", "change"],
  data() {
    return {
      list: [],
      fullList: [],
    };
  },
  computed: {},
  mounted() {
    Object.keys(timezone).forEach((key) => {
      this.fullList.push({
        id: key,
        label: timezone[key],
      });
    });
    this.list = this.fullList;
  },
  methods: {
    handleChange(checkedValues) {
      this.$emit("update:modelValue", checkedValues);
      this.$emit("change", checkedValues);
    },
    handleSearch(inputValue) {
      this.list = [
        ...this.fullList.filter((item) => item.label.includes(inputValue)),
      ];
    },
    clear() {},
  },
});
</script>
