<template>
  <div
    class="flex flex-col items-center justify-center w-1/4 p-3 transform bg-white border rounded-lg shadow-sm  hover:border-primary-500 :hover:text-primary-500"
  >
    <div
      class="absolute flex items-center justify-center w-auto h-3 mr-1 text-yellow-300 rounded-full "
      style="top: 8px; right: 8px"
      v-if="item?.attributes.isSample"
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