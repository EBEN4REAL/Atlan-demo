<template>
  <div class="border border-gray-200 divide-y divide-gray-100 rounded">
    <div v-for="item in list" :key="item.guid" @click="select(item.guid)">
      <div
        class="p-3 text-gray-500"
        :class="
          item.guid === selected
            ? 'border-l-4 border-primary-500 bg-blue-100'
            : 'bg-white'
        "
      >
        <p class="mb-1 font-medium text-gray-700">{{ item.name }}</p>
        <p class="mb-1 font-medium">
          {{ item.elementDefs.length }} elements(s)
        </p>
        <p class="mb-0 font-light">
          Updated {{ updateTime(item.updateTime) }} by
          {{ item.updatedBy }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useTimeAgo } from "@vueuse/core";

export default defineComponent({
  name: "EnumList",
  props: {
    list: Array,
    selected: String,
  },
  emits: ["update:selected"],
  setup(props, context) {
    function select(id: string) {
      context.emit("update:selected", id);
    }

    function updateTime(time: string) {
      return useTimeAgo(time).value;
    }

    return {
      updateTime,
      select,
    };
  },
});
</script>
