<template>
  <div class="border border-gray-200 divide-y rounded">
    <div
      v-for="(item, index) in finalList"
      :key="item.guid"
      class="p-3 bg-white cursor-pointer"
      :class="{
        'border-bottom': finalList.length - 1 !== index,
        'border-l-4 border-left-color bg-blue-100':
          selectedBm && item.guid === selectedBm.guid,
      }"
      @click="e => selectBm(item)"
    >
      <div class="mb-1 font-w700">
        <!-- // TODO {{ isUpdateBmSameAsCurrentBm(item) ? updatedBm.displayName  : item.displayName }} -->
        {{ isUpdateBmSameAsCurrentBm(item) ? updatedBm.name : item.name }}
        <sup
          class=""
          v-if="isUpdateBmSameAsCurrentBm(item) || (item && item.guid === 'new')"
          >*</sup
        >
      </div>
      <div class="mb-1 font-size-sm">
        {{
          isUpdateBmSameAsCurrentBm(item)
            ? updatedBm.description || "-"
            : item.description || "-"
        }}
      </div>
      <div class="font-size-sm">
        <span class="font-w700"
          >{{
            isUpdateBmSameAsCurrentBm(item)
              ? updatedBm.attributeDefs.length || 0
              : item.attributeDefs.length || 0
          }}
          attribute(s)</span
        >
        <!-- <createUpdateInfo
          :rootComponent="'span'"
          :updatedAt="item.updateTime"
          :updatedBy="item.updatedBy"
          :entityType="`bm-list-item-${item.guid}`"
        /> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { reactive, Ref, toRefs, computed } from "vue";
import { defineComponent } from "vue";
export default defineComponent({
  props: ["finalList", "selectedBm", "updatedBm"],
  setup(props, context) {
    const isUpdateBmSameAsCurrentBm = (item: { guid: any }) => {
      if (item && updatedBm && updatedBm.guid && updatedBm.guid === item.guid) {
        return true;
      }
      return false;
    };
    // * Methods
    const selectBm = item => context.emit("selectBm", item);
    // * Computed
    const finalList = computed(() => props.finalList);
    const selectedBm = computed(() => props.selectedBm);
    const updatedBm = computed(() => props.updatedBm);
    return {
      finalList,
      selectedBm,
      updatedBm,
      isUpdateBmSameAsCurrentBm,
      selectBm,
    };
  },
});
</script>
<style scoped>
.border-left-color {
  border-left-color: rgba(32, 38, 210);
}
</style>
