<template>
  <a-select
    :value="modelValue"
    :show-search="true"
    :filterOption="true"
    style="width: 100%"
    :allowClear="true"
    @change="handleChange"
    @search="handleSearch"
  >
    <template v-for="options in list" :key="options.name">
      <a-select-option :value="options.name">
        <div class="flex flex-col">
          <div>
            {{ options.name }}
            <span v-if="options.user_count">({{ options.user_count }})</span>
          </div>
        </div>
      </a-select-option>
    </template>
  </a-select>
</template>
      
<script lang="ts">
import { defineComponent, ref } from "vue";
import fetchGroupList from "~/composables/group/fetchGroupList";

export default defineComponent({
  props: {
    modelValue: {
      type: String,
      required: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    let now = ref(true);
    const { list, handleSearch } = fetchGroupList(now);
    const handleChange = (checkedValues: string) => {
      emit("update:modelValue", checkedValues);
      emit("change", checkedValues);
    };
    return {
      list,
      handleSearch,
      handleChange,
    };
  },
  methods: {
    // handleSearch(value: any) {
    //   if (this.listAsync) {
    //     clearTimeout(this.debounce);
    //     this.debounce = setTimeout(() => {
    //       this.listAsync(value);
    //     }, 100);
    //   }
    // },
    // handleChange(values: any) {
    //   if (!this.forceClear) {
    //     this.$emit("change", values);
    //   } else {
    //     this.forceClear = false;
    //   }
    // },
    // clear() {
    //   this.forceClear = true;
    //   this.selected = null;
    // },
  },
});
</script>
      
<style lang="less" module>
</style>

   