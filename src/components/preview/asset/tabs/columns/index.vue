
<template>
  <div class="flex flex-col h-full pb-3">
    <div class="flex px-3 mb-3">
      <a-input
        placeholder="Search.."
        class=""
        @input="handleSearchChange"
      ></a-input>
    </div>
    <div class="overflow-y-auto">
      <div class="mt-3">
        <p
          class="px-3 mb-0 text-xs font-medium tracking-tight text-gray-500 uppercase "
        >
          Featured Columns
        </p>
      </div>
      <div class="mt-3">
        <p
          class="px-3 mb-0 text-xs font-medium tracking-tight text-gray-500 uppercase "
        >
          Pinned Columns
        </p>
      </div>

      <p
        class="px-3 mb-0 text-xs font-medium tracking-tight text-gray-500 uppercase "
      >
        All columns
      </p>
      <DynamicScroller
        :items="list?.value"
        keyField="guid"
        :minItemSize="24"
        class="px-1 scroller-column"
        :buffer="400"
      >
        <template v-slot="{ item, index, active }">
          <DynamicScrollerItem
            :item="item"
            :active="active"
            :data-index="index"
          >
            <div
              class="flex items-center justify-between px-2 py-1 align-middle rounded  hover:bg-white hover:border"
            >
              <div
                class="w-full leading-none tracking-tight text-gray-600 truncate "
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
      <p class="px-3 mb-0 cursor-pointer text-primary">Load more..</p>
    </div>
  </div>
  <!-- </div>
  </div> -->
</template>
          
<script lang="ts">
import { ref, watch } from "vue";
import { defineComponent } from "vue";

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

    let entityFilters = ref({
      condition: "AND",
      criterion: [
        {
          attributeName: "tableQualifiedName",
          operator: "eq",
          attributeValue: props.item?.attributes?.qualifiedName,
        },
      ],
    });

    const { list, getDataType, mutate, body } = fetchColumns(
      now,
      "",
      entityFilters.value,
      20,
      0
    );

    let debounce = null;

    const handleSearchChange = (value: any) => {
      if (value.target.value == "") {
        body.value.query = "";
        mutate();
      } else {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          body.value.query = value.target.value;
          mutate();
        }, 100);
      }
    };

    watch(
      () => props.item.guid,
      () => {
        entityFilters.value = {
          condition: "AND",
          criterion: [
            {
              attributeName: "tableQualifiedName",
              operator: "eq",
              attributeValue: props.item?.attributes?.qualifiedName,
            },
          ],
        };
        body.value.sortBy = "order";
        body.value.sortOrder = "ASCENDING";
        mutate();
      }
    );

    return { list, getDataType, mutate, handleSearchChange };
  },
});
</script>


   


<style scoped>
.scroller-column {
}
</style>