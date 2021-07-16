import graphlib from "@dagrejs/graphlib";
import { SourceList } from "~/constant/source";

/**
 * Gets the mapped string for the Node type
 * @returns {String}
 */

const getNodeTypeText = {
  Table: "Table",
  AtlanColumn: "Column",
  View: "View",
  AtlanDatabase: "Database",
  AtlanSchema: "Schema",
  AtlanBIDashboard: "BI Dashboard",
  AtlanBICollection: "BI Collection",
  AtlanBIWidget: "BI Widget",
  AtlanBIModel: "BI Model",
  AtlanBIExplore: "BI Explore",
  AtlanProcess: "Process",
  AtlanIntegration: "Integration",
};

/**
 * Gets the Font Awesome Icon class for the Node type
 * @returns {String}
 */
export const getNodeTypeIcon = {
  Table: "far fa-table text-table",
  Column: "far fa-columns text-column",
  View: "far fa-th-list text-view",
  Database: "far fa-database",
  Schema: "far fa-box",
  "BI Dashboard": "far fa-user-chart",
  "Bi Collection": "far fa-folder",
  "Bi Widget": "far fa-chart-pie-alt",
  "Bi Model": "far fa-compass",
  "Bi Explore": "far fa-eye",
  Process: "far fa-code",
  Integration: "far fa-link text-database",
  Query: "far fa-code",
};

/**
 * Fetches the Icon source value for a BI tool
 * @returns {String}
 */
export { SourceList };

/**
 * Gets the type of the node
 * @param {Object} node
 * @returns {String}
 */
const getType = (node) => getNodeTypeText[node.typeName];

/**
 * Gets the source of the node
 * @param {Object} node
 * @returns {String}
 */
const getSource = (node) => node.attributes.qualifiedName.split("/")[1];

/**
 * Gets the cycles in the graph
 * @param {Object} graph - Graph returned from graphlib
 * @returns {Array}
 */
export const getCycles = (graph) => graphlib.alg.findCycles(graph);

/**
 * Checks if Node is a Process Node
 * @param {Object} graph - Graph returned from graphlib
 * @param {Object} node
 * @returns {Boolean}
 */
const isProcessNode = (graph, node) =>
  graph.node(node).typeName === "AtlanProcess";

/**
 * Checks if the graph is Cyclic
 * @param {Object} graph - Graph returned from graphlib
 * @returns {Boolean}
 */
export const isCyclic = (graph) => !graphlib.alg.isAcyclic(graph);

/**
 * Stores the computed graph relations to be used as source for search
 * @returns {Array}
 */
export const searchItems = [];

/**
 * Stores the computed graph relations
 * @returns {Array}
 * @see getPredecessors for usage.
 * @see getSuccessors for usage.
 */
export const graphRelations = [];

/**
 * Stores the computed graph group relations
 * @returns {Array}
 * @see getPredecessors for usage.
 * @see getSuccessors for usage.
 */
export const graphGroupRelations = [];

/**
 * Adds a graph relation
 * @param {Array} relations
 * @param {String} fromEntityId
 * @param {String} toEntityId
 * @param {String} path
 * @param {String} relationType
 */
function addRelation(
  relations,
  fromEntityId,
  toEntityId,
  path,
  relationType = "graph"
) {
  const index = relations.findIndex((gr) => {
    return gr.relationshipId === `${fromEntityId}@${toEntityId}`;
  });
  if (index === -1)
    relations.push({
      fromEntityId,
      toEntityId,
      relationshipId: `${fromEntityId}@${toEntityId}`,
      path,
      relationType,
    });
}

/**
 * Creates the internal graph data structure
 * @param {Object} lineage - Lineage data from the API
 * @returns {Object} The computed graph from graphlib
 */
export function buildGraph(lineage) {
  const g = new graphlib.Graph({
    directed: true,
  });
  if (lineage && lineage.guidEntityMap) {
    Object.values(lineage.guidEntityMap).forEach((value) => {
      g.setNode(value.guid, {
        ...value,
      });
    });

    lineage.relations.forEach((item) => {
      g.setEdge(item.fromEntityId, item.toEntityId);
    });
  }
  return g;
}

/**
 * Returns an Obj populated with the data of the entity
 * @param {Object} graph - Graph returned from graphlib
 * @param {String} baseEntityGuid - The guid of the base entity
 * @param {String} baseEntity - The base entity
 * @returns {Object}
 */
export function getBaseEntity(graph, baseEntityGuid, baseEntity = null) {
  const node =
    graph && baseEntityGuid ? graph.node(baseEntityGuid) : baseEntity;

  return {
    type: getType(node),
    source: getSource(node),
    ...node,
  };
}

/**
 * Gets the successors of a given node/base entity recursively.
 * @param {Object} graph - Graph returned from graphlib
 * @param {String} baseEntityGuid - The guid of the base entity
 * @param {Boolean} showProcessNodes - Show or Hide the process nodes
 * @param {String} direction - The direction of the graph, Both | Input (upstream) | Output (downstream)
 * @param {Boolean} isGetPath
 * @returns {Array}
 * @see getSuccessors for more details.
 */
export function getPredecessors(
  graph,
  baseEntityGuid,
  showProcessNodes,
  direction,
  isGetPath = null
) {
  const show = direction === "BOTH" || direction === "INPUT";
  if (!show && !isGetPath) return [];
  if (!isGetPath) graphRelations.length = 0; // resets the relations on graph recomputation

  // 2D Matrix of predecessors from every iteration [[guid],[guid, guid, ...]]
  const result = [[baseEntityGuid]];
  let index = 0;

  while (result[index].length > 0) {
    const currIteration = result[index];
    const currIterationSet = new Set(); // a Set containing predecessors of the current iteration (guid)

    currIteration.forEach((guid) => {
      // Find predecessors for each guid in the current iteration
      graph.predecessors(guid).forEach((pred) => {
        if (isGetPath) {
          currIterationSet.add(pred);
        } else {
          const hasPredecessors = graph.predecessors(pred).length !== 0;

          if (isProcessNode(graph, pred) && hasPredecessors) {
            // If process node
            if (!showProcessNodes) {
              graph.predecessors(pred).forEach((pPred) => {
                addRelation(graphRelations, pPred, guid, "upstream");
                currIterationSet.add(pPred);
              });
            } else {
              addRelation(graphRelations, pred, guid, "upstream");
              currIterationSet.add(pred);
            }
          } else if (!isProcessNode(graph, pred)) {
            // If not a process node
            addRelation(graphRelations, pred, guid, "upstream");
            currIterationSet.add(pred);
          }
        }
      });
    });

    result.push(Array.from(currIterationSet));
    index += 1;
  }
  result.pop();
  result.shift();
  return result;
}

/**
 * Gets the successors of a given node/base entity recursively.
 * @param {Object} graph - Graph returned from graphlib
 * @param {String} baseEntityGuid - The guid of the base entity
 * @param {Boolean} showProcessNodes - Show or Hide the process nodes
 * @param {String} direction - The direction of the graph, Both | Input (upstream) | Output (downstream)
 * @param {Boolean} isGetPath
 * @returns {Array}
 * @see getPredecessors for more details.
 */
export function getSuccessors(
  graph,
  baseEntityGuid,
  showProcessNodes,
  direction,
  isGetPath = null
) {
  const show = direction === "BOTH" || direction === "OUTPUT";
  if (!show && !isGetPath) return [];
  if (direction === "OUTPUT" && !isGetPath) graphRelations.length = 0; // resets the relations on graph recomputation

  // 2D Matrix of successors from every iteration [[guid],[guid, guid, ...]]
  const result = [[baseEntityGuid]];
  let index = 0;

  while (result[index].length > 0) {
    const currIteration = result[index];
    const currIterationSet = new Set(); // a Set containing successors of the current iteration (guid)

    currIteration.forEach((guid) => {
      // Find successors for each guid in the current iteration
      graph.successors(guid).forEach((succ) => {
        if (isGetPath) {
          currIterationSet.add(succ);
        } else {
          const hasSuccesssors = graph.successors(succ).length !== 0;

          if (isProcessNode(graph, succ) && hasSuccesssors) {
            // If process node
            if (!showProcessNodes) {
              graph.successors(succ).forEach((pSucc) => {
                addRelation(graphRelations, guid, pSucc, "downstream");
                currIterationSet.add(pSucc);
              });
            } else {
              addRelation(graphRelations, guid, succ, "downstream");
              currIterationSet.add(succ);
            }
          } else if (!isProcessNode(graph, succ)) {
            // If not a process node
            addRelation(graphRelations, guid, succ, "downstream");
            currIterationSet.add(succ);
          }
        }
      });
    });

    result.push(Array.from(currIterationSet));
    index += 1;
  }
  result.pop();
  result.shift();
  return result;
}

/**
 * This is used to generate the group based relations for the boxes
 * @param {Object} groupBasedGuids
 */
function generateGroupBasedRelations(groupBasedGuids) {
  graphGroupRelations.length = 0;

  Object.keys(groupBasedGuids).forEach((fromGroupId) => {
    graphRelations.forEach((relation) => {
      Object.keys(groupBasedGuids).forEach((toGroupId) => {
        const from = groupBasedGuids[fromGroupId].includes(
          relation.fromEntityId
        );
        const to = groupBasedGuids[toGroupId].includes(relation.toEntityId);
        if (from && to)
          addRelation(
            graphGroupRelations,
            fromGroupId,
            toGroupId,
            relation.path,
            "graphGroup"
          );
      });
    });
  });
}

/**
 * This is used to create a column based layout that will be used to map the depth
 * @param {Object} graph - Graph returned from graphlib
 * @param {Object} baseEntity
 * @param {Array} predecessors
 * @param {Array} successors
 * @returns {Array}
 */
export function buildLayoutColumns(
  graph,
  baseEntity,
  predecessors,
  successors
) {
  const groupBasedGuids = {};

  const getLayoutColumns = (direction, paths) => {
    const result = [];

    paths.forEach((path) => {
      const pathResult = [];
      const typeSourceSet = new Set(); // a Set for all unique type and source mappings
      const typeSourceEntity = [];

      path.forEach((p) => {
        const node = graph.node(p);
        const type = getType(node);
        const source = getSource(node);

        typeSourceSet.add(`${type}-${source}`); // eg 'BI Explore-Looker'
        typeSourceEntity.push({ type, source, node });
      });

      typeSourceSet.forEach((setItem) => {
        const [type, source] = setItem.split("-");
        const fields = [];
        const fieldsGuidSet = new Set();

        // group entities as fields under each unique type and source mapping
        typeSourceEntity.forEach((item) => {
          if (
            getType(item.node) === type &&
            getSource(item.node) === source &&
            !fieldsGuidSet.has(item.node.guid)
          ) {
            const source = getSource(item.node);
            fieldsGuidSet.add(item.node.guid);
            fields.push({ ...item.node, direction, source });
          }
        });

        pathResult.push({
          type,
          source,
          fields,
          groupId: `group-${fields[0]?.guid}`,
        });
      });

      result.push(pathResult);
    });

    return result;
  };

  const predecessorsLayoutColumns = getLayoutColumns(
    "upstream",
    predecessors
  ).reverse();
  const successorsLayoutColumns = getLayoutColumns("downstream", successors);
  const baseEntityLayoutColumn = [
    {
      type: baseEntity.type,
      source: baseEntity.source,
      fields: [baseEntity],
      groupId: `group-base-${baseEntity.guid}`,
      base: true,
    },
  ];

  const layoutColumns = [
    ...predecessorsLayoutColumns,
    baseEntityLayoutColumn,
    ...successorsLayoutColumns,
  ];

  searchItems.length = 0;

  layoutColumns.flat().forEach((i) => {
    i.fields.forEach((j) => {
      searchItems.push({ type: i.type, text: j.displayText, guid: j.guid });
      if (!isProcessNode(graph, j.guid)) {
        if (groupBasedGuids[i.groupId]) groupBasedGuids[i.groupId].push(j.guid);
        else groupBasedGuids[i.groupId] = [j.guid];
      }
    });
  });

  generateGroupBasedRelations(groupBasedGuids);

  return [
    ...predecessorsLayoutColumns,
    baseEntityLayoutColumn,
    ...successorsLayoutColumns,
  ];
}
