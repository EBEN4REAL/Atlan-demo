<template>
  <a-select
    :value="modelValue"
    :show-search="true"
    :auto-clear-search-value="true"
    @search="handleSearch"
    @change="handleChange"
  >
    <template v-for="item in list" :key="item.id">
      <a-select-option :value="item.id">
        <div class="flex flex-col">
          <div>{{ item.label }}</div>
        </div>
      </a-select-option>
    </template>
  </a-select>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Select from "@common/selector/index.vue";

import { Day } from "~/constant/day";

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
  computed: {
    list() {
      const temp = [];
      Day.forEach((item) => {
        temp.push({
          id: item.id,
          label: item.label,
        });
      });
      return temp;
    },
  },
  mounted() {
    // if (this.default) {
    //   this.selected = this.default;
    // } else if (Intl.DateTimeFormat().resolvedOptions().timeZone) {
    //   this.selected = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // }
  },
  methods: {
    handleChange(checkedValues) {
      this.$emit("update:modelValue", checkedValues);
      this.$emit("change", checkedValues);
    },
    handleSearch(input: string) {
      this.list.filter((item) => item.label.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    },
    clear() {},
  },
});
</script>
