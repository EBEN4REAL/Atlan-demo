<template>
  <div class="flex">
    <div class="px-3 border-r border-gray-200 border-dashed">
      <p class="mb-1 text-gray-500">Show/Hide</p>
      <a-checkbox-group
        v-model:value="assetTypesSelected"
        @change="updateFilters"
      >
        <div class="flex flex-col space-y-1">
          <a-checkbox
            :value="type"
            v-for="(type, index) in assetTypesFiltered"
            :key="index"
            >{{ type }} ({{
              assetTypesLengthMapInjection[activeKeyInjection][type] || 0
            }})</a-checkbox
          >
        </div>
      </a-checkbox-group>
    </div>
    <div class="pl-3">
      <p class="mb-1 text-gray-500">Depth</p>
      <a-radio-group v-model:value="level" @change="updateDepth">
        <div class="flex flex-col space-y-1">
          <a-radio :value="1">Level 1</a-radio>
          <a-radio :value="2">Level 2</a-radio>
          <a-radio :value="3">Level 3</a-radio>
          <a-radio :value="4">Max</a-radio>
        </div>
      </a-radio-group>
    </div>
  </div>
</template>

<script lang="ts">
// Vue
import { defineComponent, inject, ref, computed } from "vue";

export default defineComponent({
  setup() {
    const level = ref(1);
    const assetTypes = ["Table", "View", "Column", "Bi Dashboard"];
    const assetTypesSelected = ref([]);

    const activeKeyInjection = inject("activeKey");
    const assetTypesLengthMapInjection = inject("assetTypesLengthMap");
    const depthInjection = inject("updateDepth");
    const filterInjection = inject("updateFilters");

    const assetTypesLengthMap = computed(() => {
      return assetTypesLengthMapInjection.value?.[activeKeyInjection.value];
    });
    const assetTypesFiltered = computed(() => {
      return assetTypes.filter((type) => {
        return assetTypesLengthMap.value?.[type];
      });
    });

    assetTypesSelected.value = assetTypesFiltered.value;

    const updateDepth = () => {
      depthInjection(level.value);
    };
    const updateFilters = (e: []) => {
      assetTypesSelected.value = e;
      filterInjection(e);
    };

    return {
      assetTypesSelected,
      assetTypesLengthMapInjection,
      assetTypesFiltered,
      activeKeyInjection,
      level,
      updateDepth,
      updateFilters,
    };
  },
});
</script>
