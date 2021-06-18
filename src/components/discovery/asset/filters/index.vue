


<template>
  <a-collapse
    v-model:activeKey="activeKey"
    :bordered="false"
    class="bg-transparent"
    :class="$style.filter"
    :accordion="true"
  >
    <a-collapse-panel
      v-for="item in List"
      :key="item.id"
      :header="item.label"
      class="bg-transparent"
    >
      <component
        :is="item.component"
        :item="item"
        @change="handleChange"
      ></component>
    </a-collapse-panel>
  </a-collapse>
</template>
    
<script lang="ts">
import { defineAsyncComponent, defineComponent } from "vue";
import { List } from "./filters";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  name: "HelloWorld",
  components: {
    Status: defineAsyncComponent(() => import("@common/facets/status.vue")),
    Owners: defineAsyncComponent(() => import("@common/facets/owners.vue")),
    Advanced: defineAsyncComponent(() => import("@common/facets/advanced.vue")),
  },
  props: {},
  data() {
    return {
      List,
      activeKey: "",
      searchParam: {
        entityFilters: {},
      } as Components.Schemas.SearchParameters,
      filterMap: {} as { [key: string]: any },
      filters: {} as Components.Schemas.FilterCriteria,
    };
  },
  emits: ["change"],
  mounted() {},
  methods: {
    handleChange(value: any) {
      console.log("handle Change filters", value);

      // this.filters.condition = "AND";
      // const found = List.find((item) => item.id == value.id);
      // if (found) {
      //   let criteria = <Components.Schemas.FilterCriteria>{
      //     condition: found.overallCondition.toUpperCase(),
      //     criterion: [],
      //   };
      //   found.filters.forEach((element) => {
      //     let groupCriteria = <Components.Schemas.FilterCriteria>{
      //       condition: element.condition,
      //       criterion: [],
      //     };

      //     console.log(value);
      //     if (value.payload[element.attributeName]) {
      //       if (value.payload[element.attributeName].length > 0) {
      //         value.payload[element.attributeName].forEach((e: any) => {
      //           let valCriteria = <Components.Schemas.FilterCriteria>{};

      //           valCriteria.attributeName = element.attributeName;

      //           console.log(e);
      //           // special condition for null support
      //           if (e === "is_null") {
      //             valCriteria.operator = "isNull";
      //           } else {
      //             valCriteria.attributeValue = e;
      //             valCriteria.operator = element.operator;
      //           }

      //           if (element.isMultiple) {
      //             groupCriteria.criterion.push(valCriteria);
      //           } else {
      //             criteria.criterion.push(valCriteria);
      //           }
      //         });
      //         if (element.isMultiple) {
      //           criteria.criterion.push(groupCriteria);
      //         }
      //       }
      //     }
      //   });
      //   console.log(criteria);
      //   this.filterMap[found.id] = criteria;
      // }

      // console.log(this.filterMap);
      // this.searchParam.entityFilters.condition = "AND";
      // this.searchParam.entityFilters.criterion = [];
      // Object.keys(this.filterMap).forEach((key) => {
      //   this.searchParam.entityFilters.criterion.push(this.filterMap[key]);
      // });
      // this.$emit("change", this.searchParam);
    },
  },
});
</script>
    
    
    
<style lang="less" module>
.filter {
  :global(.ant-collapse-item) {
    @apply border-none;
  }
}
</style>
    