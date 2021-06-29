<template>
  <div class="w-full bg-white">
    <p class="mb-1 text-xs font-semibold leading-tight text-gray-500 uppercase">
      Total Assets
    </p>
    <LoadingView style="min-height: 100px" v-if="isLoading"></LoadingView>
    <ErrorView style="min-height: 100px" v-else-if="isError"></ErrorView>
    <div v-else>
      <p
        class="mb-1 text-2xl font-semibold leading-tight text-gray-800 uppercase "
      >
        {{ numeralFormat(assetDistributionSum) }}
      </p>
      <div
        v-for="item in assetTypeListArray(assetTypeList)"
        :key="item.id"
        class="flex flex-col mt-4 space-y-2"
      >
        <div class="flex justify-between">
          <div class="flex">
            <component :is="item.id" class="w-auto h-5 mr-1"></component>
            {{ item.label }}
          </div>
          <div>
            {{ numeralFormat(item.count) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { BaseAttributes, BasicSearchAttributes } from "~/constant/projection";
import { ConnectionType } from "~/types/atlas/connection";

import fetchAssetDiscover from "~/composables/asset/fetchAssetDiscover";
import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
// import EmptyView from "@common/empty/index.vue";

export default defineComponent({
  mixins: [],
  components: { LoadingView, ErrorView },
  props: {
    item: {
      type: Object as PropType<ConnectionType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    let now = ref(true);

    console.log(props.item);
    const defaultBody = ref({
      typeName: "Catalog",
      excludeDeletedEntities: true,
      includeClassificationAttributes: true,
      includeSubClassifications: true,
      includeSubTypes: true,
      limit: 0,
      offset: 0,
      attributes: [...BaseAttributes, ...BasicSearchAttributes],
      entityFilters: {
        condition: "AND",
        criterion: [
          {
            attributeName: "connectionQualifiedName",
            operator: "eq",
            attributeValue: props.item?.attributes?.qualifiedName,
          },
        ],
      },
      aggregationAttributes: ["__typeName.keyword"],
    });
    const { totalCount, listCount, assetTypeList, isLoading, isError } =
      fetchAssetDiscover(now, defaultBody);

    const assetTypeListArray = (list: any) => {
      let temp = [];
      Object.keys(list).forEach((key) => {
        temp.push({
          id: key,
          label: key,
          count: list[key.toLowerCase()] || list[key.toUpperCase()],
        });
      });
      return temp;
    };

    return {
      totalCount,
      listCount,
      isLoading,
      assetTypeList,
      assetTypeListArray,
      isError,
    };
  },
  mounted() {},
});
</script>