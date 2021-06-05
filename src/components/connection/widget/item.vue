<template>
  <div class="flex justify-between border-b py-2">
    <div class="flex flex-col">
      <p class="mb-0 text-dark-400 tr">
        <fa icon="fas check-circle" class="text-green-500"></fa
        ><span class="tracking-wide ml-2">{{ phase(item) }}</span>
      </p>
      <p class="mb-0 text-gray-400">{{ botName(item) }}</p>
      {{ connectionQualifiedName(item) }}
    </div>
  </div>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
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
  mounted() {
    console.log(this.item);
  },
});
</script>