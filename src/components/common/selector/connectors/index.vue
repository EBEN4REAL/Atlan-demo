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
    <template v-for="item in filteredList" :key="item.id">
      <a-select-option :value="item.id">
        <div class="flex items-center">
          <img :src="item.image" class="w-auto h-3 mr-1" />{{ item.label }}
        </div>
      </a-select-option>
    </template>
  </a-select>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import SourceMixin from "~/mixins/source";
import fetchConnectionList from "~/composables/connection/fetchConnectionList";
import { useConnectionsStore } from "~/pinia/connections";

export default defineComponent({
  props: {
    modelValue: {
      required: false,
    },
  },
  emits: ["update:modelValue", "change"],
  setup(props, { emit }) {
    console.log(props.modalVale, "modalValue");
    const store = useConnectionsStore();

    // let now = ref(true);

    let connectorsDropdown = ref(null);
    let searchValue = ref("");
    // const { list } = fetchConnectionList(now);
    // const sourceMap = computed(() => {
    //   return [
    //     ...new Set(list.value?.map((item) => item.attributes.integrationName)),
    //   ];
    // });

    const filteredList = computed(() => {
      return store.getSourceList?.filter((item) =>
        item.id.toLowerCase().includes(searchValue.value.toLowerCase())
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
      filteredList,
      handleSearch,
      handleChange,
      connectorsDropdown,
    };
  },
});
</script>
