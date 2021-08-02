<template>
  <a-select
    :value="modelValue"
    placeholder="Status"
    :show-search="true"
    :autoClearSearchValue="true"
    @search="handleSearch"
    :allowClear="true"
    :filterOption="false"
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
      list: [] as any[],
    };
  },
  mounted() {
    this.list = RunstatusList.filter(
      (item) => item.id.toLowerCase() !== "running"
    );
  },
  emits: ["update:modelValue", "change"],
  methods: {
    handleChange(checkedValues) {
      this.$emit("update:modelValue", checkedValues);
      this.$emit("change", checkedValues);
    },
    handleSearch(inputValue) {
      if (inputValue) {
        this.list = [
          ...RunstatusList.filter((item: any) => {
            return item.label.toLoweCase().includes(inputValue.toLowerCase());
          }),
        ];
      }
    },
    clear() {},
  },
});
</script>
