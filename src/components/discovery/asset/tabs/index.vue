<template>
  <a-tabs
    class="w-full"
    v-model:activeKey="assetType"
    :class="$style.assetbar"
    @change="handleChange"
    type="card"
  >
    <a-tab-pane :key="item.id" v-for="item in assetTypeList">
      <template #tab>
        {{ item.label }}

        <span v-if="item.id === 'Catalog' && total > 0"
          >({{ numeralFormat(total) }})</span
        >
        <span v-if="assetTypeMap[item.id] && assetTypeMap[item.id] > 0"
          >({{ numeralFormat(assetTypeMap[item.id]) }})</span
        >
      </template>
    </a-tab-pane>
  </a-tabs>
</template>
    
<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from "vue";
import fetchConnectionList from "~/composables/connection/fetchConnectionList";

import { AssetTypeList } from "~/constant/assetType";
import { CONNECTION_FETCH_LIST } from "~/constant/store_types";
import { ConnectionType } from "~/types/atlas/connection";

export default defineComponent({
  props: {
    assetTypeList: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    assetTypeMap: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
    total: {
      type: Number,
      required: false,
      default() {
        return 0;
      },
    },
    modelValue: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    connectors: {
      type: Array,
      required: false,
      default() {
        return ["snowflake"];
      },
    },
  },
  emits: ["refresh", "update:modelValue"],
  setup(props, { emit }) {
    const assetType = ref(props.modelValue);

    const handleChange = () => {
      emit("update:modelValue", assetType.value);
    };

    let testMapping = [
      {
        id: "Table",
        label: "Table",
        heirarchy: ["Database", "Schema"],
        attribute: "tableQualifiedName",
      },
      {
        id: "Column",
        label: "Column",
        heirarchy: ["Database", "Schema", "Table"],
        attribute: "columnQualifiedName",
      },
      {
        id: "View",
        label: "View",
        heirarchy: ["Database", "Schema"],
        attribute: "viewQualifiedName",
      },
      {
        id: "Database",
        label: "Database",
        heirarchy: [],
        attribute: "databaseQualifiedName",
      },
      {
        id: "Schema",
        label: "Schema",
        heirarchy: [],
        attribute: "schemaQualifiedName",
      },
    ];

    watch(
      () => props.assetTypeList,
      () => {
        //check if the current assetType exists in assetTypeList
        const found = props.assetTypeList.find(
          (item) => item.id === assetType.value
        );
        if (!found) {
          assetType.value = "Catalog";
        }
      },
      {
        immediate: true,
      }
    );

    // const filteredList = computed(() => {
    //   let foundConnections: ConnectionType[] = [];

    //   // get one example of connection for each connector
    //   props.connectors?.forEach((element) => {
    //     let found = cachedConnectionList.value.find((item) => {
    //       return item.attributes?.integrationName === element;
    //     });
    //     if (found) {
    //       foundConnections.push(found);
    //     }
    //   });

    //   //filter on discoverable and mappings and order asset types
    //   let filteredTypeList = AssetTypeList.filter((item) => {
    //     if (item.isDiscoverable) {
    //       let isAvailable = false;
    //       foundConnections.forEach((conn) => {
    //         //TODO - Change to dynamic mapping
    //         let found = testMapping.find((map) => {
    //           return map.id === item.id;
    //         });
    //         console.log(found);
    //         if (found) {
    //           isAvailable = true;
    //         }
    //       });
    //       return isAvailable;
    //     }
    //     return false;
    //   }).sort((x, y) => {
    //     return y.orderWeight - x.orderWeight;
    //   });

    //   console.log(props.assetTypeList);
    //   //Update Count from Aggregations
    //   filteredTypeList.forEach((f) => {
    //     if (props.assetTypeList[f.id]) {
    //       f.count = props.assetTypeList[f.id];
    //     } else if (props.assetTypeList[f.id.toLowerCase()]) {
    //       f.count = props.assetTypeList[f.id.toLowerCase()];
    //     }
    //   });

    //   return filteredTypeList;
    // });

    // let foundConnections = [];
    // props.connectors?.forEach((element) => {
    //   let found = cachedConnectionList.value.find((item) => {
    //     return item.attributes?.integrationName === element;
    //   });
    //   if (found) {
    //     foundConnections.push(found);
    //   }
    // });

    // if (props.defaultAssetType) {
    //   assetType.value = props.defaultAssetType;
    // }
    return {
      assetType,
      handleChange,
    };
  },
});
</script>


      
<style lang="less" module>
.assetbar {
  height: 32px !important;
  min-height: 32px !important;

  :global(.ant-tabs-nav-container) {
    height: 32px !important;
    min-height: 32px !important;
  }

  :global(.ant-tabs-bar) {
    @apply border-b border-gray-200 !important;
    margin-bottom: 0px;
  }

  :global(.ant-tabs-tab) {
    height: 32px !important;
    line-height: 30px !important;
    @apply bg-transparent border-0  !important;
  }

  :global(.ant-tabs-tab-active) {
    @apply bg-white border-t border-l border-r border-gray-200 !important;
  }

  :global(.ant-tabs-ink-bar) {
    @apply hidden;
  }
}
</style>
      