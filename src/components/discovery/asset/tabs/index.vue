<template>
  <a-tabs class="w-full" :class="$style.assetbar" v-model:value="assetType">
    <a-tab-pane :key="item.id" v-for="item in filteredList">
      <template #tab>
        {{ item.label }}
        <span v-if="item.count && item.count > 0"
          >({{ numeralFormat(item.count) }})</span
        >
      </template>
      <template #extra> asdas</template>
    </a-tab-pane>
    <!-- <a-tab-pane key="2" tab="Tab 2"></a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3"></a-tab-pane> -->
  </a-tabs>
</template>
    
<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from "vue";
import fetchConnectionList from "~/composables/connection/fetchConnectionList";

import { AssetTypeList } from "~/constant/assetType";
import { CONNECTION_FETCH_LIST } from "~/constant/store_types";
import connector from "~/mixins/connector";
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
    defaultAssetType: {
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
  setup(props, { emit }) {
    let list = ref([]);
    list.value = AssetTypeList.filter((item) => {
      return item.isDiscoverable == true;
    });

    const { list: cachedConnectionList } = fetchConnectionList(
      CONNECTION_FETCH_LIST
    );

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

    const filteredList = computed(() => {
      let foundConnections: ConnectionType[] = [];

      // get one example of connection for each connector
      props.connectors?.forEach((element) => {
        let found = cachedConnectionList.value.find((item) => {
          return item.attributes?.integrationName === element;
        });
        if (found) {
          foundConnections.push(found);
        }
      });

      //filter on discoverable and mappings and order asset types
      let filteredTypeList = AssetTypeList.filter((item) => {
        if (item.isDiscoverable) {
          let isAvailable = false;
          foundConnections.forEach((conn) => {
            //TODO - Change to dynamic mapping
            let found = testMapping.find((map) => {
              return map.id === item.id;
            });
            console.log(found);
            if (found) {
              isAvailable = true;
            }
          });
          return isAvailable;
        }
        return false;
      }).sort((x, y) => {
        return y.orderWeight - x.orderWeight;
      });

      console.log(props.assetTypeList);
      //Update Count from Aggregations
      filteredTypeList.forEach((f) => {
        f.count = props.assetTypeList[f.id.toLowerCase()];
      });

      return filteredTypeList;
    });

    const assetType = ref("");

    // let foundConnections = [];
    // props.connectors?.forEach((element) => {
    //   let found = cachedConnectionList.value.find((item) => {
    //     return item.attributes?.integrationName === element;
    //   });
    //   if (found) {
    //     foundConnections.push(found);
    //   }
    // });

    console.log(filteredList);

    // if (props.defaultAssetType) {
    //   assetType.value = props.defaultAssetType;
    // }
    return {
      assetType,
      list,
      cachedConnectionList,
      filteredList,
    };
  },
});
</script>


      
<style lang="less" module>
.assetbar {
  :global(.ant-tabs-bar) {
    margin-bottom: 0px;
    border-color: #fff !important;
  }

  :global(.ant-tabs-tab) {
    margin: 0 32px 0 0 !important;
    padding: 6px 8px !important;
  }

  :global(.ant-tabs-ink-bar) {
    height: 0px;
  }
}
</style>
      