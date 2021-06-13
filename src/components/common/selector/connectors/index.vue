<template>
  <a-select
    :value="modelValue"
    placeholder="Connections"
    :show-search="true"
    :autoClearSearchValue="true"
    @search="handleSearch"
    :allowClear="true"
    :filterOption="false"
    @change="handleChange"
  >
    <template v-for="item in filteredList" :key="item">
      <a-select-option :value="item">
        <div class="flex items-center">
          <img :src="logo(item)" class="w-auto h-3 mr-1" />{{ item }}
        </div>
      </a-select-option>
    </template>
  </a-select>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import SourceMixin from "~/mixins/source";
import fetchConnectionList from "~/composables/connection/fetchConnectionList";

export default defineComponent({
  mixins: [SourceMixin],
  props: {
    modelValue: {
      type: String,
      required: false,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    let now = ref(true);
    let searchValue = ref("");
    const { list } = fetchConnectionList(now);
    const sourceMap = computed(() => {
      return [
        ...new Set(list.value?.map((item) => item.attributes.integrationName)),
      ];
    });

    const filteredList = computed(() => {
      return sourceMap.value?.filter((item) =>
        item?.toLowerCase().includes(searchValue.value.toLowerCase())
      );
    });
    const handleSearch = (inputValue: string) => {
      searchValue.value = inputValue;
    };
    const handleChange = (checkedValues: string) => {
      emit("update:modelValue", checkedValues);
      emit("change", checkedValues);
    };
    return {
      list,
      sourceMap,
      filteredList,
      handleSearch,
      handleChange,
    };
  },
});
</script>
