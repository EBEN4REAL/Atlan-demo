<template>
  <div class="flex flex-col space-y-3">
    <div
      class="px-2"
      v-if="
        item?.typeName?.toLowerCase() === 'table' ||
        item?.typeName?.toLowerCase() === 'view' ||
        item?.typeName?.toLowerCase() === 'materialisedview' ||
        item?.typeName?.toLowerCase() === 'tablepartition'
      "
    >
      <p class="mb-0 text-sm tracking-wide text-gray-400">Rows/Columns</p>
      <p class="mb-0 text-gray">
        <span
          v-if="
            item?.typeName.toLowerCase() === 'view' ||
            item?.typeName.toLowerCase() === 'materialisedview'
          "
        >
          <a-popover placement="left">
            <template #content>
              <div
                class="overflow-y-auto"
                style="max-width: 350px; max-height: 250px; min-width: 100px"
              >
                <span
                  v-html="getSQLHighlighted(item?.attributes.viewDefinition)"
                >
                </span>
              </div>
              <div class="flex justify-between mt-3">
                <a>Copy</a>
                <a>View Lineage</a>
              </div>
            </template>
            <span class="font-bold tracking-wide cursor-pointer text-primary">
              SQL</span
            >,
          </a-popover>
        </span>
        <span v-if="item?.typeName.toLowerCase() === 'table'">
          <span class="font-bold tracking-wide">{{
            rowCount(item, true)
          }}</span>
          rows,
        </span>
        <span class="font-bold tracking-wide cursor-pointer text-primary">{{
          columnCount(item, true)
        }}</span>
        cols
      </p>
    </div>

    <Description :item="item" :key="item.guid"></Description>

    <Status :item="item" :key="item.guid"></Status>

    <Owners :item="item" :key="item.guid"></Owners>
  </div>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
import AssetMixin from "~/mixins/asset";

import Description from "./description.vue";
import Status from "./status.vue";
import Owners from "./owners.vue";
import { highlight } from "sql-highlight";
import { format } from "sql-formatter";

export default defineComponent({
  mixins: [AssetMixin],
  components: { Status, Description, Owners },
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    const getSQLHighlighted = (text: string) => {
      return highlight(format(text), {
        html: true,
      });
    };
    return {
      getSQLHighlighted,
    };
  },
});
</script>
  
  
     
<style lang="less">
code.sql {
  font-family: monospace;
  background-color: #000;
}

.sql-hl-keyword {
  color: #f000f0;
}
.sql-hl-function {
  color: #ff0000;
}
.sql-hl-number {
  color: #00ff00;
}
.sql-hl-special {
  color: #00ff00;
}
.sql-hl-bracket {
  color: #ffff00;
}
</style>
          