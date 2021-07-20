<template>
  <div>
    <p class="mb-1 text-xs font-semibold leading-tight text-gray-500 uppercase">
      Total Assets
    </p>
    <div class="text-xl text-gray-900">{{ numeralFormat(assetTypeSum) }}</div>

    <LoadingView style="min-height: 100px" v-if="isLoading"></LoadingView>

    <div v-else>
      <div
        v-for="item in assetTypeList"
        :key="item.id"
        class="flex flex-col mt-4 space-y-2"
      >
        <div class="flex justify-between">
          <div class="flex">
            <component :is="item.id" class="w-auto h-5 mr-1"></component>
            {{ item.label }}
          </div>
          <div>
            {{ numeralFormat(item.count) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, ref, watch } from "vue";
import { ConnectionType } from "~/types/atlas/connection";

import useColumnList from "~/composables/bots/useColumnList";
import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";

export default defineComponent({
  mixins: [],
  components: { LoadingView, ErrorView },
  props: {
    item: {
      type: Object as PropType<ConnectionType>,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    const now = ref(true);
    const defaultBody = reactive({
      limit: 1,
      aggregationAttributes: ["__typeName.keyword"],
    });
    const { assetTypeList, isLoading, refresh, assetTypeSum } = useColumnList(
      now,
      defaultBody
    );

    watch(
      () => props.item.guid,
      () => {
        refresh();
      }
    );

    return { assetTypeList, isLoading, assetTypeSum };
  },
  mounted() {},
});
</script>
