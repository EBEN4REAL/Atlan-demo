<template>
  <a-select
    :value="modelValue"
    placeholder="Status"
    :show-search="true"
    :auto-clear-search-value="true"
    :allow-clear="true"
    :filter-option="false"
    @search="handleSearch"
    @change="handleChange"
  >
    <template v-for="item in list" :key="item.id">
      <a-select-option :value="item.id">
        <div>{{ item.label }}</div>
      </a-select-option>
    </template>
  </a-select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Select from "@common/selector/index.vue";

import { RunstatusList } from "~/constant/runstatus";

export default defineComponent({
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
      list: [] as any[],
    };
  },
  computed: {},
  mounted() {
    this.list = RunstatusList.filter(
      (item) => item.id.toLowerCase() !== "running"
    );
  },
  methods: {
    handleChange(checkedValues) {
      this.$emit("update:modelValue", checkedValues);
      this.$emit("change", checkedValues);
    },
    handleSearch(inputValue) {
      if (inputValue) {
        this.list = [
          ...RunstatusList.filter((item: any) => item.label.toLoweCase().includes(inputValue.toLowerCase())),
        ];
      }
    },
    clear() {},
  },
});
</script>
