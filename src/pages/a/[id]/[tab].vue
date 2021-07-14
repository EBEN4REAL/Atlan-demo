<template>
  <div>
    <div class="h-28 p-4">
      {{ response?.entities[0].attributes.name || "" }}
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
import Overview from "~/components/assetProfile/tabs/overview.vue";
import Lineage from "~/components/assetProfile/tabs/lineage.vue";
import { Search } from "~/api/atlas/search";
export default defineComponent({
  components: {
    overview: Overview,
    lineage: Lineage,
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

    const { response, error, loading, mutate } = Search.BasicSearch(
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
      id,
      tab,
      current,
      selectTab,
      selectedTab,
      response,
    };
  },
});
</script>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>