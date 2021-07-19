<template>
  <div class="">
    <div class="">
      <div class="flex gap-x-2">
        <a-popover placement="bottomLeft" trigger="click">
          <template #content>
            <div class="flex flex-col space-y-2">
              <template v-for="(item, index) in list" :key="item.typeName">
                <div>
                  <p class="mb-0 text-gray-500">{{ item.name }}</p>
                  <AssetSelector
                  :key='item.typeName+"_"+ dirtyTimestamp'
                    @change="handleChange"
                    v-model:value="asset[item.attribute]"
                    :typeName="item.typeName"
                    :filter="getFilter(index)"
                    style="width: 200px"
                  ></AssetSelector>
                </div>
              </template>
            </div>
          </template>
          <div class="flex px-3 py-2 cursor-pointer">
            <p
              class="flex items-center mb-0 text-xs tracking-wide text-gray-900 align-middle hover:bg-gray-50"
            >
              <fa icon="fal plug" class="mr-1"></fa>All Databases
              <fa icon="fas caret-down" class="text-primary-500"></fa>
            </p>
          </div>
        </a-popover>
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useConnectionsStore } from "~/pinia/connections";

import AssetSelector from "@common/selector/asset/index.vue";

export default defineComponent({
  components: { AssetSelector },
  props: {
    connector: {
      type: Object,
      required: false,
    },
  },
  emits: ["change"],
  setup(props, { emit }) {
    let asset: { [key: string]: any } = ref({});

    const list = computed(() => {
      return props.connector?.hierarchy || [];
    });

    const getFilter = (index) => {

      console.log(asset);
      if (index > 0) {
        const item = list.value[index - 1];
        if (item) {
          return {
            condition: "AND",
            criterion: [
              {
                attributeName: item.attribute,
                attributeValue: asset[item.attribute],
                operator: "eq",
              },
            ],
          };
        }
      }
    };

    const dirtyTimestamp = ref("");
    const handleChange = () => {
      dirtyTimestamp.value = Date.now().toString();
    };

    return { list, asset,getFilter,handleChange, dirtyTimestamp };
  },
});
</script>