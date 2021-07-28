<template>
  <div
    v-if="layoutColumns.length > 0"
    class="component"
    :class="{ 'absolute top-0': !isCyclic }"
  >
    <!-- Lineage Graph -->
    <div
      v-if="!isCyclic"
      ref="lineage_graph_ref"
      class="lineage-graph"
      :class="{
        'cursor-grab': !panStarted,
        'cursor-grabbing': panStarted,
        'cursor-wait': columnsListLoading,
      }"
      @dblclick="_getPath(null)"
    >
      <div ref="lineage_graph_container_ref" class="lineage-graph__container">
        <!-- Layout Columns -->
        <div
          v-for="(layoutColumn, index) in layoutColumns"
          :key="'layoutColumn' + String(index)"
          class="layoutColumn"
        >
          <div
            v-for="(group, index) in layoutColumn"
            :key="'group' + String(index)"
            class="group"
            :class="{
              process: group.type === 'Process',
              base: group.base,
            }"
          >
            <div v-if="group.type !== 'Process'" class="group-header">
              <div
                class="group-header__node"
                :ref="
                  (el) => {
                    el ? (refs[group.groupId] = el) : refs;
                  }
                "
                :id="group.groupId"
              >
                <div class="group-header__node-group">{{ group.type }}</div>
                <div class="group-header__node-source">
                  <img :src="getIcon(group.source)" />
                  {{ group.source }}
                </div>
              </div>
            </div>
            <div
              class="group-content"
              :style="_getContentHeight(group.groupId, group.fields.length)"
            >
              <div
                @click.stop="_getPath(node.guid)"
                v-for="(node, index) in group.fields"
                :key="'node' + String(index)"
                class="group-content__item"
                :style="_getItemTopPosition(group.type, group.groupId, index)"
              >
                <div
                  v-if="group.type !== 'Process'"
                  :ref="
                    (el) => {
                      el ? (refs[node.guid] = el) : refs;
                    }
                  "
                  :id="node.guid"
                  class="group-content__item-node"
                  :class="{
                    base: group.base,
                    highlighted: _isHighlightedNode(node.guid),
                    'highlighted-base': node.guid === pathGuid,
                  }"
                >
                  <span :style="{ width: showColumns ? '10rem' : '100%' }">
                    {{ node.displayText }}
                  </span>
                  <button
                    v-if="showColumns"
                    @click.stop="_fetchColumnsList(group.groupId, node.guid)"
                    :class="{
                      'cursor-wait':
                        columnsListLoading && expandedNodeGroups[group.groupId],
                    }"
                  >
                    <fa
                      icon="fal minus"
                      v-if="expandedNodeGroups[group.groupId] === node.guid"
                    ></fa>
                    <fa icon="fal plus" v-else></fa>
                  </button>
                </div>
                <!-- <LineageColumnList /> -->
                <div
                  :ref="
                    (el) => {
                      el ? (refs[node.guid] = el) : refs;
                    }
                  "
                  :id="node.guid"
                  v-if="group.type === 'Process'"
                  class="group-content__item-node"
                  :class="{
                    highlighted: _isHighlightedNode(node.guid),
                    'highlighted-base': node.guid === pathGuid,
                    process: group.type === 'Process',
                  }"
                >
                  <fa icon="fal cog" class="w-5 h-5"></fa>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cyclic Lineage Graph Info -->
    <div v-if="isCyclic" class="relative block w-full h-full no-transform">
      <div class="flex items-center justify-center h-full flex-column">
        <!-- <img :src="LineageEmptyIllus" style="width: 32rem" /> -->
        <p class="mb-0">
          Sorry, we don't support cyclic lineages yet."
          <br />
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Vue
import {
  defineComponent,
  inject,
  onMounted,
  onBeforeUnmount,
  ref,
  nextTick,
  computed,
} from "vue";

// Util
import { getIcon } from "~/components/lineage/util";

// Components
import LineageColumnList from "~/components/lineage/lineageColumnList.vue";

// Composables
import * as useLineageCompute from "~/composables/lineage/useLineageCompute";
import * as useLineageDOM from "~/composables/lineage/useLineageDOM";
import * as useLineageLines from "~/composables/lineage/useLineageLines";
import * as useLineagePanZoom from "~/composables/lineage/useLineagePanZoom";
import * as useLineageColumns from "~/composables/lineage/useLineageColumns";

export default defineComponent({
  name: "LineageGraphComponent",
  components: { LineageColumnList },
  setup() {
    /** DATA */
    const lineage_graph_ref = ref(null);
    const lineage_graph_container_ref = ref(null);
    const refs = ref({});
    const glGraph = ref({});
    const layoutColumns = ref([]);
    const searchItems = ref([]);
    const cycles = ref([]);
    const selectedPathGuids = ref([]);
    const lines = ref([]);
    const pathGuid = ref(null);
    const panStarted = ref(false);
    const panZoomInstance = ref({});
    const expandedNodes = ref([]);
    const expandedNodeGroups = ref({});
    const columnsListLoading = ref(false);
    const hasLineage = computed(() => {
      return lineage.value?.relations.length !== 0;
    });

    /** INJECTIONS */
    const lineage = inject("lineage");
    const asset = inject("asset");
    const linesWrapper = inject("linesWrapper");
    const setSearchItems = inject("setSearchItems");
    const showProcessNodes = inject("showProcessNodes");
    const direction = inject("direction");

    /** METHODS */
    // _computeGraphRelations
    const _computeGraphRelations = async () => {
      const {
        glGraph: a,
        layoutColumns: b,
        searchItems: c,
        cycles: d,
      } = useLineageCompute.computeGraphRelations(
        lineage,
        "graph",
        asset,
        showProcessNodes,
        direction
      );

      glGraph.value = a;
      layoutColumns.value = b;
      searchItems.value = c;
      cycles.value = d;

      // setSearchItems
      setSearchItems(searchItems);

      // getExpandedNodeHeight
      _getExpandedNodeHeight();

      // drawLines
      if (hasLineage.value) {
        const { lines: f } = useLineageLines.drawLines(refs, linesWrapper);
        lines.value = f;
      }

      // setPanZoomEvent
      await _setPanZoomEvent();

      // centerNode
      _centerNode();
    };

    // restartComputation
    const _restartComputation = () => {
      useLineageCompute.restartComputation(
        _computeGraphRelations,
        lines,
        layoutColumns,
        glGraph
      );
    };

    // _getPath
    const _getPath = (guid) => {
      useLineageLines.getPath(guid, pathGuid, selectedPathGuids);
      if (pathGuid.value && hasLineage.value) {
        const { selectedPathGuids: f } = useLineageLines.highlightLines(
          glGraph,
          pathGuid,
          lines,
          showProcessNodes,
          direction
        );
        selectedPathGuids.value = f;
      }
    };

    // _updateLines
    const _updateLines = () => {
      useLineageLines.updateLines(lines);
    };

    // _isHighlightedNode
    const _isHighlightedNode = (guid) => {
      return useLineageLines.isHighlightedNode(guid, selectedPathGuids);
    };

    // _centerNode
    const _centerNode = () => {
      useLineageDOM.centerNode(
        lineage.value.baseEntityGuid,
        layoutColumns,
        panZoomInstance
      );
    };

    // _handleZoom
    const _handleZoom = (val) => {
      useLineagePanZoom.handleZoom(val, panZoomInstance);
    };

    // _handleFullscreen
    const _handleFullscreen = (lineage_graph_wrapper_ref) => {
      useLineagePanZoom.handleFullscreen(
        _updateLines,
        lineage_graph_wrapper_ref
      );
    };

    // _getItemTopPosition
    const _getItemTopPosition = (type, groupId, currNodeIndex) => {
      console.log(type, groupId, currNodeIndex);
      console.log("expandedNodes:", expandedNodes);
      return useLineageDOM.getItemTopPosition(
        type,
        groupId,
        currNodeIndex,
        expandedNodes
      );
    };

    // _getContentHeight
    const _getContentHeight = (groupId, length) => {
      return useLineageDOM.getContentHeight(groupId, length, expandedNodes);
    };

    // _getExpandedNodeHeight
    const _getExpandedNodeHeight = () => {
      const { expandedNodes: e } = useLineageDOM.getExpandedNodeHeight(
        layoutColumns,
        refs,
        _updateLines
      );
      expandedNodes.value = e;
    };

    // _setPanZoomEvent
    const _setPanZoomEvent = async () => {
      const { panStarted: g, panZoomInstance: h } =
        await useLineagePanZoom.setPanZoomEvent(
          lineage_graph_container_ref,
          _updateLines
        );
      panStarted.value = g.value;
      panZoomInstance.value = h.value;
    };

    // _pausePanZoomEvent
    const _pausePanZoomEvent = (val) => {
      useLineagePanZoom.pausePanZoomEvent(val, panZoomInstance);
    };

    // _fetchColumnsList
    const _fetchColumnsList = async (groupId, guid) => {
      columnsListLoading.value = true;
      const { expandedNodeGroups: $expandedNodeGroups } =
        await useLineageColumns.fetchColumnsList(
          groupId,
          guid,
          expandedNodes,
          _pausePanZoomEvent,
          _getExpandedNodeHeight
        );
      expandedNodeGroups.value = $expandedNodeGroups;
      columnsListLoading.value = false;
    };

    /** LIFECYCLE */
    // onMounted
    onMounted(() => {
      _computeGraphRelations();
    });

    // onBeforeUnmount
    onBeforeUnmount(() => {
      nextTick(() => {
        lines.value.forEach((l) => l.remove());
        if (panZoomInstance.value) panZoomInstance.value.dispose();
      });
    });

    return {
      lines,
      lineage_graph_ref,
      lineage_graph_container_ref,
      refs,
      columnsListLoading,
      panStarted,
      glGraph,
      layoutColumns,
      searchItems,
      cycles,
      expandedNodeGroups,
      pathGuid,
      getIcon,
      isCyclic: false, //
      showColumns: false, //
      _getItemTopPosition,
      _getContentHeight,
      _handleZoom,
      _handleFullscreen,
      _getPath,
      _restartComputation,
      _isHighlightedNode,
      _fetchColumnsList,
    };
  },
});
</script>

<style>
.leader-line {
  /* z-index: 9 !important; */
}
</style>

<style lang="less" scoped>
.top-0 {
  top: 0;
}

.cursor-wait {
  cursor: wait;
}

.cursor-grab {
  cursor: grab;
}

.cursor-grabbing {
  cursor: grabbing;
}

.no-transform {
  transform-origin: unset !important;
  transform: unset !important;
}

.component {
  position: unset;
  width: 100%;
  height: 100%;
}

.lineage-graph {
  width: 100%;
  height: 100%;
  position: absolute;
  // top: 7%;
  overflow: hidden;
  -ms-overflow-style: none; /* Hide scrollbar for  IE and Edge */
  scrollbar-width: none; /* Hide scrollbar for  Firefox */

  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar for Chrome, Safari and Opera */
  }

  &__container {
    width: 100%;
    display: flex;
    align-items: center;
  }
}

.layoutColumn {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.group {
  border: 1px solid #e6e6e7;
  background: #ffffff;
  font-size: 0.7rem;
  margin-bottom: 4rem;
  margin-right: 6rem;
  width: 15rem;
  z-index: 7;

  &.base {
    border-color: #2351cc;
  }

  &.process {
    border: unset;
    width: 3rem;
    margin-bottom: unset;
  }

  &-header {
    background: #fff;
    position: relative;
    height: 2.3rem;

    &__node {
      position: absolute;
      top: 0;
      height: 100%;
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 0.7rem 1rem;

      &-group {
        font-weight: 600;
      }
      &-source {
        font-size: 0.6rem;
        text-transform: uppercase;
        display: flex;
        align-items: center;

        & > img {
          width: 0.8rem;
          height: 0.8rem;
          margin-right: 0.4rem;
        }
      }
    }
  }

  &-content {
    background: #f8f8fd;
    position: relative;
    overflow: hidden;

    &__item {
      position: absolute;
      width: calc(100% - 30px);
      cursor: pointer;
      left: 15px;

      &-node {
        display: flex;
        justify-content: space-between;
        border: 2px solid #e5e5e5;
        border-radius: 4px;
        padding: 4px 8px;
        background: white;
        position: relative;
        text-transform: lowercase;

        & > span {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        & > button {
          border: 0;
          padding: 0;
          margin: 0;
          background: unset;
          outline: unset;

          & > i {
            border: 1px solid #e7e7e7;
            padding: 0 4px;
            line-height: 1.8;
            border-radius: 2px;
            font-size: 0.5rem;
          }
        }

        &.base {
          border-color: #2351cc;
          background: #e3f0fc;

          & button i {
            border-color: #2351cc !important;
          }
        }

        &.highlighted {
          background: #e3f0fc;
          border-color: #2e5ace;

          &-base {
            background: #2e5ace;
            color: white;
            border-color: #2e5ace !important;

            & button i {
              border-color: white !important;
              color: white !important;
            }

            & > i {
              color: #e2f0fc !important;
            }
          }

          & button i {
            border-color: #2351cc;
            color: #2351cc;
          }
        }

        &.process {
          padding: unset;
          border-radius: 99px;
          border: 1px solid #495057;
          width: 1.6rem;
          height: 1.6rem;
          display: flex;
          justify-content: center;
          align-items: center;
          line-height: 1;
          margin-bottom: 3rem;

          & > i {
            color: #495057;
            font-size: 1.1rem;
          }
        }
      }
    }
  }
}
</style>
