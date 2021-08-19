<template>
  <div v-if="lineageList">
    <div class="flex items-center mb-3 gap-x-3">
      <a-input-search
        :value="query"
        :placeholder="`Search ${direction} assets`"
        @change="searchQuery"
      >
      </a-input-search>
      <a-popover placement="bottomRight">
        <template #content>
          <Preferences />
        </template>
        <a-button size="default"
          ><fa icon="fal cog" class="mr-1"></fa
          ><fa icon="fal chevron-down" class="text-xs text-primary-focus"></fa
        ></a-button>
      </a-popover>
    </div>
    <div>
      <AssetList :lineage-list="lineageList" />
    </div>
  </div>
  <div v-if="!lineageList || lineageList.length === 0">
    <img :src="emptyScreen" alt="Empty" class="w-3/5 m-auto mt-4" />
    <div class="mt-4 text-sm text-center text-gray">Result is empty</div>
  </div>
</template>

<script lang="ts">
// Vue
import { defineComponent, inject, ref } from "vue";
// Components
import Preferences from "./preferences.vue";
import AssetList from "./assetList.vue";
// Assets
import emptyScreen from "~/assets/images/empty_search.png";

export default defineComponent({
  components: { Preferences, AssetList },
  props: {
    direction: {
      type: String,
      required: true,
    },
    lineageList: {
      type: Array,
      required: true,
    },
  },
  setup() {
    const query = ref("");
    const queryInjection = inject("searchQuery");
    const searchQuery = (e) => {
      query.value = e.target.value;
      queryInjection(query.value);
    };

    return {
      query,
      searchQuery,
      emptyScreen,
    };
  },
});
</script>
