<template>
  <div
    class="flex flex-col items-center justify-center w-1/4 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md hover:border-primary-500 :hover:text-primary-500"
  >
    <img :src="logo(item)" class="w-auto h-10 mb-3" />
    <div class="text-gray-900">{{ title(item) }}</div>
  </div>
</template>
              
  <script lang="ts">
import { defineComponent } from "vue";
import ConnectorMixin from "~/mixins/connector";

export default defineComponent({
  mixins: [ConnectorMixin],
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