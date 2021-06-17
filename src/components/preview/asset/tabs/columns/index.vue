
<template>
  <div class="flex flex-col h-full pb-3">
    <div class="flex px-3 mb-3">
      <a-input placeholder="Search.." class=""></a-input>
    </div>
    <DynamicScroller
      :items="list.value"
      keyField="guid"
      :minItemSize="24"
      class="px-1 scroller"
      :buffer="400"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem :item="item" :active="active" :data-index="index">
          <div
            class="flex items-center justify-between px-2 py-1 align-middle rounded  hover:bg-white hover:border"
            v-for="item in list.value"
            :key="item.guid"
          >
            <div
              class="w-full leading-none tracking-tight text-gray-600 truncate"
            >
              <fa
                icon="fas key"
                class="mr-1 text-xs text-yellow-300 pushtop"
              ></fa>
              {{ item.attributes.name }}
            </div>

            <component
              :is="getDataType(item)?.image"
              class="mr-1 text-gray-700"
            ></component>
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
  <!-- </div>
  </div> -->
</template>
          
<script lang="ts">
import { ref, watch } from "vue";
import { defineComponent } from "vue";
import { Components } from "~/api/atlas/client";

import fetchColumns from "~/composables/columns/fetchColumns";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  setup(props: any) {
    let now = ref(true);

    let entityFilters = {
      condition: "AND",
      criterion: [
        {
          attributeName: "tableQualifiedName",
          operator: "eq",
          attributeValue: props.item?.attributes?.qualifiedName,
        },
      ],
    };

    watch(props.item.guid, () => {
      mutate();
    });

    const { list, getDataType, mutate } = fetchColumns(
      now,
      "",
      entityFilters,
      20,
      0
    );

    return { list, getDataType };
  },
});
</script>


   


<style scoped>
.scroller {
  height: 100%;
  overflow-y: auto;
}
</style>