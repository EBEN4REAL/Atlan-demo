import { nextTick } from "vue";
import {
  buildGraph,
  buildLayoutColumns,
  getBaseEntity,
  getSuccessors,
  getPredecessors,
  searchItems,
} from "~/components/lineage/util";


export const computeGraphRelations = (
  lineage,
  type,
  asset = null,
  showProcessNodes = null,
  direction = null
) => {
  const baseEntityGuid = lineage.value?.baseEntityGuid;
  const baseEntityComputed = lineage.value?.guidEntityMap[baseEntityGuid];
  const glGraph = buildGraph(lineage.value);
  let predecessors = [];
  let successors = [];
  let layoutColumns = [];
  const layoutColumnsList: any = [];
  const lineageList: any = {};
  const cycles = [];

  // Check for Empty lineage
  if (lineage.value?.relations.length === 0) {
    if (type === "widget") {
      return { upstream: [], downstream: [] };
    } 
      const baseEntity = getBaseEntity(null, null, asset.value);
      const baseEntityData = {
        type: baseEntity.type,
        source: baseEntity.source,
        fields: [baseEntity],
        groupId: `group-base-${baseEntity.guid}`,
        base: true,
      };
      layoutColumns = [[baseEntityData]];

      searchItems.length = 0;
      searchItems.push({
        type: baseEntity.type,
        text: baseEntity.displayText,
        guid: baseEntity.guid,
      });

      return {
        glGraph,
        layoutColumns,
        searchItems,
        cycles,
      };
    
  }

  // Compute graph
  if (glGraph) {
    const args = [glGraph, baseEntityGuid];

    if (type === "graph") args.push(showProcessNodes.value, direction.value);

    predecessors = getPredecessors(...args);
    successors = getSuccessors(...args);

    const baseEntity = getBaseEntity(
      glGraph,
      baseEntityGuid,
      baseEntityComputed
    );

    layoutColumns = buildLayoutColumns(
      glGraph,
      baseEntity,
      predecessors,
      successors
    );

    if (type === "widget") {
      layoutColumns.forEach((lc: []) => {
        lc.forEach((lci: { fields: [] }) => {
          lci.fields.forEach((f: {}) => {
            layoutColumnsList.push(f);
          });
        });
      });
      layoutColumnsList.forEach((i: { direction: string }) => {
        if (!i.direction) return;
        if (lineageList[i.direction]) lineageList[i.direction].push(i);
        else lineageList[i.direction] = [i];
      });
    }
  }

  if (type === "widget") {
    if (Object.keys(lineageList).length === 0)
      return { upstream: [], downstream: [] };
    return lineageList;
  } 
    return {
      glGraph,
      layoutColumns,
      searchItems,
      cycles,
    };
  
};

export const restartComputation = (
  computeGraphRelations,
  lines,
  layoutColumns,
  glGraph
) => {
  nextTick(() => {
    let done = false;

    lines.value.forEach((l, index, arr) => {
      l.remove();
      if (index === arr.length - 1) done = true;
    });

    if (lines.value.length === 0) done = true;

    if (done) {
      lines.value = [];
      layoutColumns.value = [];
      glGraph.value = {};
      computeGraphRelations();
    }
  });
};
