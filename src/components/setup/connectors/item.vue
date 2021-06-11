<template>
  <div
    class="flex flex-col items-center justify-center w-1/4 p-3 bg-white border rounded-lg shadow-sm  hover:shadow-md hover:border-primary-500 :hover:text-primary-500"
  >
    <img :src="logo" class="w-auto h-10 mb-3" />
    <div class="text-gray-900">{{ item.attributes.name }}</div>
  </div>
</template>
              
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { SourceList } from "~/constant/source";
import ConnectorMixin from "~/mixins/connector";
import { BotsType } from "~/types/atlas/bots";

export default defineComponent({
  mixins: [ConnectorMixin],
  components: {},
  props: {
    item: {
      type: Object as PropType<BotsType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  computed: {
    logo(): any {
      return SourceList.find(
        (src) => src.id === this.item.attributes.integrationName
      )?.image;
    },
  },
  mounted() {
    console.log(this.item);
  },
});
</script>