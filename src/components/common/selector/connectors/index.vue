<template>
  <a-select
    ref="connectorsDropdown"
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
          <img :src="logo(item)" class="w-auto h-3 mr-1" />{{
            item?.charAt(0).toUpperCase() + item?.substr(1).toLowerCase()
          }}
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
      required: false,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    let now = ref(true);

    let connectorsDropdown = ref(null);
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
      connectorsDropdown?.value?.blur();
      emit("update:modelValue", checkedValues);
      emit("change", checkedValues);
    };
    return {
      list,
      sourceMap,
      filteredList,
      handleSearch,
      handleChange,
      connectorsDropdown,
    };
  },
});
</script>
