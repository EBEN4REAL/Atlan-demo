<template>
  <div class="flex">
    <div class="pr-3 border-r border-gray-200 border-dashed">
      <p class="mb-1 text-gray-500">Show/Hide</p>
      <a-checkbox-group v-model:value="projection" @change="handleChange">
        <div class="flex flex-col space-y-1">
          <a-checkbox value="description">Description</a-checkbox>
          <a-checkbox value="owners">Owners</a-checkbox>
          <a-checkbox value="terms">Business Terms</a-checkbox>
          <a-checkbox value="classifications">Classifications</a-checkbox>
          <a-checkbox value="rows">Row/Columns</a-checkbox>
          <a-checkbox value="heirarchy">Heirarchy</a-checkbox>
        </div>
      </a-checkbox-group>
    </div>
    <div class="pl-3">
      <p class="mb-1 text-gray-500">Order</p>
      <a-radio-group @change="handeChangeSorting" v-model:value="sorting">
        <div class="flex flex-col space-y-1">
          <a-radio value="default">Relevance</a-radio>
          <a-radio value="Catalog.popularityScore|descending"
            >Popularity Score(High-Low)</a-radio
          >
          <a-radio value="Catalog.popularityScore|ascending"
            >Popularity Score(Low-High)</a-radio
          >
          <a-radio value="name|ascending">Name (A-Z)</a-radio>
          <a-radio value="name|descending">Name (Z-A)</a-radio>
        </div>
      </a-radio-group>
    </div>
  </div>
</template>
      
<script lang="ts">
import { defineComponent, Ref, ref } from "vue";

import ConnectionSelector from "@common/selector/connections/index.vue";
import ConnectorSelector from "@common/selector/connectors/index.vue";
import useDiscoveryPreferences from "~/composables/preference/useDiscoveryPreference";

export default defineComponent({
  components: { ConnectionSelector, ConnectorSelector },
  emits: ["change", "sort"],
  props: {
    defaultProjection: {
      type: Array,
    },
    defaultSorting: {
      type: String,
      default() {
        return "default";
      },
    },
  },
  setup(props, { emit }) {
    const projection: Ref<any[]> = ref([]);
    if (props.defaultProjection?.length > 0) {
      projection.value = props.defaultProjection || [];
    }
    // const { projection } = useDiscoveryPreferences();
    const handleChange = () => {
      emit("change", projection.value);
    };

    const sorting = ref("");

    sorting.value = props.defaultSorting || "default";
    const handeChangeSorting = () => {
      emit("sort", sorting.value);
    };

    return {
      projection,
      sorting,
      handleChange,
      handeChangeSorting,
    };
  },
});
</script>