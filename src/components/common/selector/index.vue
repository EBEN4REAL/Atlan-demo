<template>
  <a-select
    :show-search="true"
    :filterOption="true"
    :placeholder="placeholder"
    :allowClear="allowClear"
    :autoClearSearchValue="true"
    :autofocus="autofocus"
    :bordered="bordered"
    :disabled="disabled"
    :maxTagCount="maxTagCount"
    :mode="mode"
    optionLabelProp="id"
    :loading="loading"
    :maxTagTextLength="maxTagTextLength"
    @search="handleSearch"
    @change="handleChange"
  >
    <slot :list="list"> </slot>

    <!-- <template #suffixIcon> sads </template> -->
    <!-- <template v-slot:suffixIcon>
        <fa icon="fal filter" class="mr-1" />
      </template> -->
  </a-select>
</template>
      
  <script lang="ts">
import { defineComponent, PropType } from "vue";
import { SelectArray } from "~/types";

export default defineComponent({
  props: {
    placeholder: {
      type: String,
      required: false,
      default() {
        return "Search";
      },
    },

    allowClear: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    autofocus: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    bordered: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    maxTagCount: {
      type: Number,
      required: false,
      default() {
        return 10;
      },
    },
    maxTagTextLength: {
      type: Number,
      required: false,
      default() {
        return 20;
      },
    },
    mode: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    loading: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    default: {
      type: Array,
      required: false,
      default(): string[] {
        return [];
      },
    },
    list: {
      type: Array as PropType<SelectArray>,
      required: false,
      default(): SelectArray {
        return [];
      },
    },
    listAsync: {
      type: Function,
      required: false,
    },
    showSearch: {
      type: Boolean,
      required: false,
      default() {
        return true;
      },
    },
    optionLabelProp: {
      type: String,
      required: false,
      default(): string {
        return "label";
      },
    },
  },
  data() {
    return {
      forceClear: false,
      selected: null,
      debounce: null,
    };
  },
  computed: {},
  mounted() {
    if (this.multiple) {
      this.selected = this.default;
    } else {
      if (this.default.length > 0) {
        this.selected = this.default[0];
      }
    }
  },
  emits: ["change"],
  methods: {
    handleSearch(value: any) {
      if (this.listAsync) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
          this.listAsync(value);
        }, 100);
      }
    },
    handleChange(values: any) {
      if (!this.forceClear) {
        this.$emit("change", values);
      } else {
        this.forceClear = false;
      }
    },
    clear() {
      this.forceClear = true;
      this.selected = null;
    },
  },
});
</script>
      
      <style lang="less" module>
</style>
      