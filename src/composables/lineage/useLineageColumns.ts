export const fetchColumnsList = (
  groupId,
  guid,
  expandedNodes,
  pausePanZoomEvent,
  getExpandedNodeHeight
) => {
  // TODO - make API call
  const expandedNodeGroups = {};

  if (expandedNodeGroups[groupId] === guid) {
    pausePanZoomEvent(false);
    delete expandedNodeGroups[groupId];
  } else {
    pausePanZoomEvent(true);
    expandedNodeGroups[groupId] = guid;
  }

  expandedNodes.value = [];
  getExpandedNodeHeight();

  return { expandedNodeGroups };
};
