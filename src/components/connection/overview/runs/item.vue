<template>
  <tr class="mb-3 bg-white border rounded shadow-sm">
    <td class="w-3 pr-0 rounded-tl-md rounded-bl-md">
      <div class="">
        <fa
          icon="fas check-circle"
          style="display: inline-block; vertical-align: middle"
          class="text-xl text-green-500"
          v-if="status == 'Succeeded'"
        ></fa>
        <fa
          icon="fas exclamation-circle"
          class="inline-block text-xl text-red-500 align-middle"
          v-else-if="status == 'Failed'"
        ></fa>
        <fa
          icon="fas exclamation-circle"
          class="inline-block text-xl text-yellow-500 align-middle"
          v-else
        ></fa>
      </div>
    </td>
    <td class="pl-2">
      <div class="flex items-center align-middle">
        <p class="mb-0 text-base text-gray-500">{{ botName(item) }}</p>
      </div>
    </td>
    <td class="text-gray-500 rounded-br-md rounded-tr-md">
      {{ startedAt(item, true) }} ago
    </td>
    <td class="text-gray-500 rounded-br-md rounded-tr-md">
      {{ finishedAt(item, true) }}
      <span v-if="finishedAt(item, true)">ago</span>
    </td>
    <td class="text-center text-gray-500">
      {{ duration(item) }}
      <a-progress
        :percent="progressPercent(item)"
        size="small"
        v-if="status == 'Running'"
      >
        <template #format="percent, successPercent">
          {{ progress(item) }}
        </template>
      </a-progress>
    </td>
  </tr>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
import { SourceList } from "~/constant/source";
import WorkflowMixin from "~/mixins/workflow";

export default defineComponent({
  mixins: [WorkflowMixin],
  components: {},
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  computed: {
    status() {
      return this.phase(this.item);
    },
  },
  mounted() {},
  methods: {
    sourceLabel() {
      let integrationName = this.source(this.item);
      let found = SourceList.find((src) => src.id == integrationName);
      let title = integrationName;
      if (found) {
        title = found.label;
      }
      return title;
    },
    sourceImage() {
      console.log(this.item);
      let integrationName = this.source(this.item);
      console.log(integrationName);
      let found = SourceList.find((src) => src.id === integrationName);
      console.log(found);
      if (found) {
        return found.image;
      }
      return;
    },
  },
});
</script>

<style lang="less" scoped>
.table td,
.table th {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1.25rem;
  padding-right: 1.25rem;
}
</style>