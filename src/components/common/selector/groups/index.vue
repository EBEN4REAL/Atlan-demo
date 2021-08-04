<template>
  <a-select
    :value="modelValue"
    :show-search="true"
    :filter-option="true"
    style="width: 100%"
    :allow-clear="true"
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
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    const now = ref(true);
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
  data() {
    return {};
  },
  computed: {},
});
</script>
      
<style lang="less" module>
</style>

   