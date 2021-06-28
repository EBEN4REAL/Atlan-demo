<template>
  <a-select
    ref="connectionsDropdown"
    :value="modelValue"
    placeholder="Connections"
    :show-search="true"
    :autoClearSearchValue="true"
    @search="handleSearch"
    :allowClear="true"
    :filterOption="false"
    @change="handleChange"
  >
    <template v-for="item in filteredList" :key="item.guid">
      <a-select-option :value="item.attributes.qualifiedName">
        <div class="flex items-center">
          <img
            :src="logo(item?.attributes?.integrationName)"
            class="w-auto h-3 mr-1"
          />{{ item.attributes.displayName || item.attributes.name }}
        </div>
      </a-select-option>
    </template>
  </a-select>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import SourceMixin from "~/mixins/source";
import fetchConnectionList from "~/composables/connection/fetchConnectionList";
import { CONNECTION_FETCH_LIST } from "~/constant/cache";

export default defineComponent({
  mixins: [SourceMixin],
  props: {
    modelValue: {
      required: false,
    },
    connectors: {
      type: Array,
      required: false,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    let searchValue = ref("");
    let openState = ref(false);
    let connectionsDropdown = ref(null);
    let localValue = ref();

    const now = ref(true);

    const { list } = fetchConnectionList(CONNECTION_FETCH_LIST, now);
    const filteredList = computed(() => {
      return list?.value?.sort((a, b) =>
        a.attributes?.displayName.localeCompare(b.attributes?.displayName)
      );
    });

    const handleSearch = (inputValue: string) => {
      searchValue.value = inputValue;
    };
    const handleChange = (checkedValues: any) => {
      localValue.value = checkedValues;
      emit("update:modelValue", checkedValues);
      emit("change", checkedValues);
      connectionsDropdown?.value?.blur();
    };
    return {
      list,
      filteredList,
      handleSearch,
      handleChange,
      connectionsDropdown,
      openState,
      localValue,
    };
  },
});
</script>
