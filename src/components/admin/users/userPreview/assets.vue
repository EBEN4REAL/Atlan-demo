<template>
  <div>
    <a-input
      placeholder="Search"
      size="default"
      class="searchbox"
      v-model:value="queryText"
      @change="handleSearchChange"
    />
    <AssetList
      :list="list"
      :score="searchScoreList"
      :isLoading="isLoading || isValidating"
      ref="assetlist"
    ></AssetList>
  </div>
</template>

<script lang="ts">
import { computed, reactive, ref } from "vue";

import { AssetTypeList } from "~/constant/assetType";
import useAssetList from "~/composables/bots/useAssetList";
import { useDebounceFn } from "@vueuse/core";
import { SearchParameters } from "~/types/atlas/attributes";
import { Components } from "~/api/atlas/client";
import AssetList from "@/discovery/asset/list/index.vue";
import { BaseAttributes, BasicSearchAttributes } from "~/constant/projection";

export default {
  name: "Assets",
  props: {
    selectedUser: {
      type: Object,
      default: {},
    },
    selectedGroup: {
      type: Object,
      default: {},
    },
  },
  components: {
    AssetList,
  },
  setup(props) {
    const activeTab = computed(() => {
      if (Object.keys(props.selectedUser).length) return "user";
      else if (Object.keys(props.selectedGroup).length) return "group";
      return "";
    });
    let criterion: Components.Schemas.FilterCriteria[] = [];

    if (activeTab.value === "user") {
      criterion.push({
        attributeName: "ownerUsers",
        attributeValue: props.selectedUser.username,
        operator: "contains",
      });
    } else if (activeTab.value === "group") {
      criterion.push({
        attributeName: "ownerGroups",
        attributeValue: props.selectedGroup.alias,
        operator: "contains",
      });
    }
    const entityFilterPayload = [
      {
        condition: "OR",
        criterion: criterion,
      } as Components.Schemas.FilterCriteria,
    ];
    const limit = ref(20);
    const offset = ref(0);
    let assetTypeList = ref([]);
    assetTypeList.value = AssetTypeList.filter((item) => {
      return item.isDiscoverable == true;
    });
    const assetTypeListString = assetTypeList.value
      .map((item) => item.id)
      .join(",");
    let initialBody: SearchParameters = reactive({});

    initialBody = {
      limit: limit.value,
      offset: offset.value,
      typeName: assetTypeListString,
      excludeDeletedEntities: true,
      attributes: [...BaseAttributes, ...BasicSearchAttributes],
      aggregationAttributes: [],
    };
    initialBody.entityFilters = {
      condition: "AND",
      criterion: [...entityFilterPayload],
    };
    const queryText = ref("");

    const { list, replaceBody, isLoading, isValidating, searchScoreList } =
      useAssetList(ref(true), assetTypeListString, initialBody, "catalog");
    const updateBody = () => {
      // if (queryText.value) {
      initialBody.query = queryText.value;
      //   }

      replaceBody(initialBody);
    };
    const handleSearchChange = useDebounceFn((val) => {
      offset.value = 0;
      updateBody();
    }, 100);
    return {
      handleSearchChange,
      isLoading,
      isValidating,
      searchScoreList,
      list,
      queryText,
    };
  },
};
</script>

<style>
</style>