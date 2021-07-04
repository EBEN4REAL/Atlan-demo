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
import { computed, defineComponent, ref } from "vue";
import SourceMixin from "~/mixins/source";
import { useConnectionsStore } from "~/pinia/connections";

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
    const store = useConnectionsStore();

    let searchValue = ref("");
    let openState = ref(false);
    let connectionsDropdown = ref(null);
    let localValue = ref();

    const filteredList = computed(() => {
      return store.getList?.filter((item) => {
        if (props.connectors) {
          if (props.connectors.includes(item.attributes.integrationName)) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });
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
