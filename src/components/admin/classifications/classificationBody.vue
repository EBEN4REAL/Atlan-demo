<template>
  <div class="pt-6">
    <div class="flex items-center justify-between">
      <a-input
        ref="searchText"
        v-model:value="assetSearchText"
        @input="handleAssetSearch"
        type="text"
        class="bg-white shadow-none form-control border-right-0 search-input"
        placeholder="Search assets"
      >
        <template #suffix>
          <fa
            v-if="treeFilterText"
            @click="clearSearchText"
            icon="fal times-circle"
            class="ml-2 mr-1 text-red-600"
          />
          <fa
            v-if="!treeFilterText"
            icon="fal search"
            class="ml-2 mr-1 text-gray-500"
          />
        </template>
      </a-input>
      <a-button type="default" class="text-gray-500 rounded">
        <fa icon="fal filter" class="mr-2 text-gray-500" />
        Filter</a-button
      >
    </div>
    <div class="flex mt-6">
      <div class="px-3 py-2 mr-2 text-center rounded linked-btn-active">
        <p class="mb-0">Linked Assets (56)</p>
      </div>
      <div class="p-2 text-center rounded">
        <p class="mb-0">Linked Terms (6)</p>
      </div>
    </div>
    <div class="w-full mt-6 border rounded h-80"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
export default defineComponent({
  name: "ClassificationHeader",
  components: {},
  props: {},
  setup(props, context) {
    const assetSearchText = ref("");
    const handleAssetSearch = (e) => {
      assetSearchText.value = e.target.value;
    };
    return {
      assetSearchText,
      handleAssetSearch,
    };
  },
});
</script>
<style lang="less" scoped>
.three-dots {
  height: fit-content;
  cursor: pointer;
}
.search-input {
  max-width: 30%;
}
.linked-btn-active {
  background-color: #e9eefa;
  color: #2251cc;
}
</style>
