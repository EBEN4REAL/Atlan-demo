<template>
  <div
    class="flex flex-col items-center justify-center col-span-12 px-6 py-4 transform bg-white border rounded-lg shadow-sm  sm:col-span-6 md:col-span-3 lg:col-span-2 hover:border-primary-focus :hover:text-primary"
  >
    <div
      v-if="item?.attributes.isSample"
      class="absolute flex items-center justify-center w-auto h-3 mr-1 text-yellow-300 rounded-full "
      style="top: 8px; right: 8px"
    >
      <fa icon="fas lock mr-1"></fa>
    </div>

    <img :src="logo" class="w-auto h-10 mb-3" />

    <div class="flex items-center leading-none text-gray-900 align-middle">
      {{ item?.attributes.name }}
    </div>
  </div>
</template>
              
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { SourceList } from "~/constant/source";

import { BotsType } from "~/types/atlas/bots";

export default defineComponent({
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
      return (
        SourceList.find(
          (src) => src.id === this.item.attributes.integrationName
        )?.image || this.item.attributes.logo
      );
    },
  },
  mounted() {},
});
</script>