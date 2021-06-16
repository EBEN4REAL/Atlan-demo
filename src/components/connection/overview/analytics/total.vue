<template>
  <div class="grid grid-cols-12 mb-3">
    <div class="col-span-3 p-4 bg-white border rounded-lg">
      <p
        class="mb-1 text-xs font-semibold leading-tight text-gray-500 uppercase"
      >
        Total Assets
      </p>
      <p
        class="mb-1 text-lg font-semibold leading-tight text-gray-800 uppercase"
      >
        {{ numeralFormat(assetDistributionSum) }}
      </p>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { BaseAttributes, BasicSearchAttributes } from "~/constant/projection";
import { ConnectionType } from "~/types/atlas/connection";

import fetchAssetDiscover from "~/composables/asset/fetchAssetDiscover";

export default defineComponent({
  mixins: [],
  components: {},
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
    const { totalCount, listCount, assetTypeList, assetDistributionSum } =
      fetchAssetDiscover(now, defaultBody);

    return {
      totalCount,
      listCount,
      assetTypeList,
      assetDistributionSum,
    };
  },
  mounted() {},
});
</script>