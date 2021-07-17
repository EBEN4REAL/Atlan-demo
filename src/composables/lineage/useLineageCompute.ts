import {
  isCyclic,
  buildGraph,
  buildLayoutColumns,
  getBaseEntity,
  getSuccessors,
  getPredecessors,
} from "~/components/preview/asset/tabs/lineage/util";

export default function useLineageCompute(lineage) {
  const baseEntityGuid = lineage.value?.baseEntityGuid;
  const baseEntityComputed = lineage.value?.guidEntityMap[baseEntityGuid];
  const glGraph = buildGraph(lineage.value);
  const showProcessNodes = false;
  const lineageDirection = "BOTH";
  let predecessors = [];
  let successors = [];
  let layoutColumns = [];
  let layoutColumnsList: any = [];
  let lineageList: any = {};

  // Check for Empty lineage
  if (lineage.value?.relations.length === 0)
    return { upstream: [], downstream: [] };

  // Check for Cyclic
  if (isCyclic(glGraph)) return { upstream: [], downstream: [] };

  // Compute graph
  if (glGraph) {
    const args = [glGraph, baseEntityGuid, showProcessNodes, lineageDirection];

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

  if (Object.keys(lineageList).length === 0)
    return { upstream: [], downstream: [] };
  else return lineageList;
}
