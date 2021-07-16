<template>
  <LoadingView
    v-if="Object.keys(filteredLineageList).length === 0"
    class="mt-10"
  ></LoadingView>
  <a-collapse
    v-else
    :bordered="false"
    :accordion="true"
    v-model:activeKey="activeKey"
    style="height: calc(100% - 125px)"
    class="mt-2 overflow-y-hidden bg-transparent"
  >
    <a-collapse-panel
      :key="stream.key"
      class="bg-transparent border-0"
      forceRender
      v-for="stream in streams"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div class="font-semibold">
            {{ stream.name }} ({{ lineageList[stream.key]?.length || 0 }})
          </div>
          <router-link to="/lineage" class="underline"
            >Graph view
            <fa icon="fal external-link-alt" class="w-3 h-3 ml-1"></fa
          ></router-link>
        </div>
      </template>
      <Stream
        :direction="stream.key"
        :lineage-list="filteredLineageList[stream.key]"
      />
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
// Vue
import {
  defineComponent,
  ref,
  Ref,
  toRefs,
  ToRefs,
  watch,
  provide,
  onMounted,
  computed,
} from "vue";
// Composables
import useLineage from "~/composables/lineage/useLineage";
import useLineageCompute from "~/composables/lineage/useLineageCompute";
import useLineageFilters from "~/composables/lineage/useLineageFilters";
// Components
import Stream from "./stream/index.vue";
import LoadingView from "@common/loaders/section.vue";

export default defineComponent({
  components: { Stream, LoadingView },
  props: {
    item: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  setup(props) {
    const { item }: ToRefs = toRefs(props);
    const activeKey: Ref<string> = ref("upstream");
    const streams = [
      {
        key: "upstream",
        name: "Upstream",
      },
      {
        key: "downstream",
        name: "Downstream",
      },
    ];
    const lineage: Ref<{}> = ref({});
    const lineageList = ref({});
    const filteredLineageList = ref({});
    const assetTypesLengthMap = ref({});
    const depth = ref(1);
    const query = ref("");
    const filters = ref(["Table", "View", "Column", "Bi Dashboard"]);

    const updateDepth = (val: number) => (depth.value = val);
    const searchQuery = (val: string) => (query.value = val);
    const updateFilters = (val: Ref<string[]>) => (filters.value = val);
    const filtersLength = computed(() => {
      return filters.value.length;
    });

    const fetch = () => {
      const { data } = useLineage(item.value.guid, depth.value, "BOTH");
      watch(data, () => {
        lineage.value = data.value as object;
        lineageList.value = useLineageCompute(lineage);
        filter();
      });
    };

    const filter = () => {
      const { data, l } = useLineageFilters(
        lineageList,
        filters,
        query,
        activeKey
      );
      filteredLineageList.value = data;
      assetTypesLengthMap.value[activeKey.value] = l;
    };

    provide("activeKey", activeKey);
    provide("updateDepth", updateDepth);
    provide("updateFilters", updateFilters);
    provide("searchQuery", searchQuery);
    provide("assetTypesLengthMap", assetTypesLengthMap);

    watch(depth, () => fetch());
    watch(query, () => filter());
    watch(filtersLength, () => filter());

    onMounted(fetch);

    return {
      query,
      lineage,
      lineageList,
      filteredLineageList,
      assetTypesLengthMap,
      activeKey,
      streams,
    };
  },
});
</script>

<style lang="less" scoped>
:global(.ant-tabs .ant-tabs-right-content) {
  @apply pr-0 !important;
}
</style>
