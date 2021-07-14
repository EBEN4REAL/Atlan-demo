<template>
  <LoadingView v-if="isValidating" />
  <ErrorView v-else-if="error" :error="error" />
  <div v-else>
    <div class="h-24 p-4">
      <AssetHeader :asset="response?.entities[0]" />
    </div>
    <a-menu
      v-model:selectedKeys="current"
      mode="horizontal"
      @select="selectTab"
    >
      <a-menu-item key="overview"> Overview </a-menu-item>
      <a-menu-item key="lineage"> Lineage </a-menu-item>
    </a-menu>
    <div class="p-4">
      <component
        :is="selectedTab"
        :asset="response?.entities[0] || {}"
      ></component>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Overview from "~/components/asset/assetProfile/tabs/overview.vue";
import Lineage from "~/components/asset/assetProfile/tabs/lineage.vue";
import { Search } from "~/api/atlas/search";
import AssetHeader from "~/components/asset/assetProfile/assetHeader.vue";
import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
export default defineComponent({
  components: {
    overview: Overview,
    lineage: Lineage,
    AssetHeader,
    LoadingView,
    ErrorView,
  },
  setup() {
    const route = useRoute();
    const id = computed(() => route?.params?.id || "");
    const tab = computed(() => route?.params?.tab || "");

    const current = ref([tab.value]);
    const selectedTab = ref(tab.value);
    const router = useRouter();

    const body = {
      excludeDeletedEntities: true,
      includeSubClassifications: true,
      includeSubTypes: true,
      includeClassificationAttributes: true,
      entityFilters: {
        condition: "AND",
        criterion: [
          {
            attributeName: "__guid",
            operator: "eq",
            attributeValue: id.value,
          },
        ],
      },
      tagFilters: null,
      attributes: ["__guid"],
      limit: 25,
      offset: 0,
      typeName: "AtlanAsset",
    };

    const { response, error, mutate, isValidating } = Search.BasicSearch(
      body,
      {},
      {
        revalidateOnFocus: false,
      }
    );

    const selectTab = (item: any) => {
      selectedTab.value = item.key;
      router.replace(`/a/${id.value}/${item.key}`);
    };

    return {
      current,
      selectTab,
      selectedTab,
      response,
      error,
      isValidating,
    };
  },
});
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>