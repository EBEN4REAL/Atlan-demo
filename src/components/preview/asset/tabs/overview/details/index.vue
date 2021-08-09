<template>
  <div class="flex flex-col space-y-3">
    <div
      v-if="
        item?.typeName?.toLowerCase() === 'table' ||
        item?.typeName?.toLowerCase() === 'view' ||
        item?.typeName?.toLowerCase() === 'materialisedview' ||
        item?.typeName?.toLowerCase() === 'tablepartition'
      "
      class="px-2"
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

    <Description :key="item.guid" :item="item"></Description>

    <Status :key="item.guid" :item="item"></Status>

    <Owners :key="item.guid" :item="item"></Owners>
  </div>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
import { highlight } from "sql-highlight";
import { format } from "sql-formatter";
import AssetMixin from "~/mixins/asset";

import Description from "./description.vue";
import Status from "./status.vue";
import Owners from "./owners.vue";

export default defineComponent({
  components: { Status, Description, Owners },
  mixins: [AssetMixin],
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
    const getSQLHighlighted = (text: string) => highlight(format(text), {
        html: true,
      });
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
          