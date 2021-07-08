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
      class="bg-transparent"
    >
      <template #header>
        <div class="flex justify-between" :key="dirtyTimestamp">
          {{ item.label }}

          <div
            v-if="isFilter(item.id)"
            @click.stop.prevent="handleClear(item.id)"
          >
            <fa
              icon="fal times-circle"
              class="text-sm hover:text-red-500 pushtop"
            ></fa>
          </div>
        </div>
      </template>
      <component
        :ref="
          (el) => {
            refMap[item.id] = el;
          }
        "
        :is="item.component"
        :item="item"
        @change="handleChange"
      ></component>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent, ref } from "vue";
import { List } from "./filters";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  name: "HelloWorld",
  components: {
    Status: defineAsyncComponent(() => import("@common/facets/status.vue")),
    Owners: defineAsyncComponent(() => import("@common/facets/owners.vue")),
    Classifications: defineAsyncComponent(() =>
      import("@common/facets/classifications.vue")
    ),
    Advanced: defineAsyncComponent(() =>
      import("@common/facets/advanced/index.vue")
    ),
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
  emits: ["refresh"],
  setup(props, { emit }) {
    const filterMap: { [key: string]: Components.Schemas.FilterCriteria } = {};
    let filters: Components.Schemas.FilterCriteria[] = [];

    const dirtyTimestamp = ref("dirty_");

    const refMap: { [key: string]: any } = ref({});

    const refresh = () => {
      filters = [];
      Object.keys(filterMap).forEach((key) => {
        filters.push(filterMap[key]);
      });
      emit("refresh", filters);
    };
    const handleChange = (value: any) => {
      filterMap[value.id] = value.payload;
      dirtyTimestamp.value = `dirty_${Date.now().toString()}`;
      console.log(dirtyTimestamp.value);
      refresh();
    };

    const isFilter = (id) => {
      console.log(id);
      console.log(filterMap[id]);
      if (filterMap[id]) {
        if (filterMap[id]?.criterion?.length > 0) {
          return true;
        }
      }
      return false;
    };

    const handleClear = (id) => {
      console.log(refMap.value[id]);
      if (refMap.value[id]) {
        refMap.value[id].clear();
      }
    };

    return {
      handleChange,
      isFilter,
      dirtyTimestamp,
      filterMap,
      handleClear,
      refMap,
    };
  },
  mounted() {},
  methods: {
    handleChanged(value: any) {
      //   console.log("handle Change filters", value);
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

  :global(.ant-collapse-header) {
    padding-left: 18px !important;
    padding-right: 0px !important;
  }
  :global(.ant-collapse-arrow) {
    left: 0px !important;
  }

  :global(.ant-collapse-content-box) {
    padding-right: 0px;
    padding-left: 0px;
    padding-top: 0px;
  }
}
</style>
