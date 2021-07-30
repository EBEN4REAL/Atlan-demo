<template>
  <div class="border border-gray-200 rounded w-72">
    <div class="p-4 py-2 border-b-2">
      Columns({{ asset.attributes.columnCount }})
    </div>
    <a-input-search class="w-11/12 m-2 mx-3" placeholder="Search Column" />
    <div class="px-4 py-2 overflow-x-hidden overflow-y-auto h-80 w-72">
      <ColumnItem
        v-for="(data, index) in relationship?.entities || []"
        :data="data"
        :key="index"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import useAssetRelationShip from "./useAssetRelationShip";
import ColumnItem from "./columnItem.vue";

export default defineComponent({
  props: ["asset"],
  components: { ColumnItem },
  setup(props) {
    const { relationship, mutate, state, STATES } = useAssetRelationShip(
      props.asset?.guid || "",
      {
        revalidateOnFocus: false,
        dedupingInterval: 1,
      }
    );
    return {
      asset: props.asset,
      relationship,
      mutate,
      state,
      STATES,
    };
  },
});
</script>
