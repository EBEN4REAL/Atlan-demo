<template>
  <a-select
    :value="modelValue"
    :show-search="true"
    :autoClearSearchValue="true"
    @search="handleSearch"
    :filterOption="false"
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
  props: {
    modelValue: {
      type: String,
      required: false,
    },
  },
  components: {
    Select,
  },
  computed: {},
  data() {
    return {
      list: [],
      fullList: [],
    };
  },
  mounted() {
    Object.keys(timezone).forEach((key) => {
      this.fullList.push({
        id: key,
        label: timezone[key],
      });
    });
    this.list = this.fullList;
  },
  emits: ["update:modelValue", "change"],
  methods: {
    handleChange(checkedValues) {
      this.$emit("update:modelValue", checkedValues);
      this.$emit("change", checkedValues);
    },
    handleSearch(inputValue) {
      this.list = [
        ...this.fullList.filter((item) => {
          return item.label.includes(inputValue);
        }),
      ];
    },
    clear() {},
  },
});
</script>
