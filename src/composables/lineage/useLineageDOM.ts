import { nextTick, ref } from "vue";

export const getItemTopPosition = (
  type,
  groupId,
  currNodeIndex,
  expandedNodes
) => {
  const top = 20 * (currNodeIndex * 2 + 1);
  if (type === "Process") {
    return { top: `${top}px` };
  }
  let total;
  const item = expandedNodes.value.filter((node) => node?.groupId === groupId);
  const _groupId = item[0]?.groupId;
  const _height = item[0]?.height;
  const _index = item[0]?.index;

  if (_height && _groupId && currNodeIndex > _index) {
    const cnst = currNodeIndex === _index ? 0 : 25;
    total = currNodeIndex === 0 ? top : _height + top - cnst;
  } else total = top;
  return { top: `${total}px` };
};

export const getContentHeight = (groupId, length, expandedNodes) => {
  let height = 20;
  const item = expandedNodes.value.filter((node) => node?.groupId === groupId);

  const _groupId = item[0]?.groupId;
  const _height = item[0]?.height;

  for (let i = 1; i <= length; i += 1) height += 40;
  if (_height && _groupId) height = height + _height - 25;

  return { height: `${height}px` };
};

export const getExpandedNodeHeight = (layoutColumns, refs, updateLines) => {
  const expandedNodes = [];

  nextTick(() => {
    layoutColumns.value.forEach((lc) => {
      lc.forEach((lci) => {
        lci.fields.forEach((f, index) => {
          const height = refs.value[f.guid].parentElement.clientHeight;

          if (height !== 29 && height !== 28 && height !== 0)
            expandedNodes.push({
              groupId: lci.groupId,
              height,
              index,
            });
        });
      });
    });
    updateLines();
  });
  return { expandedNodes };
};

export const centerNode = (
  guid,
  layoutColumns,
  panZoomInstance,
  showDetailsView = false
) => {
  let _lcIndex;
  let _lciIndex;
  let lciLongestLength = 0;

  nextTick(() => {
    layoutColumns.value.forEach((lc, lcIndex) => {
      lc.forEach((lci, lciIndex, arr) => {
        if (arr.length > lciLongestLength) lciLongestLength = arr.length;
        lci.fields.forEach((f) => {
          if (f.guid === guid) {
            _lcIndex = lcIndex;
            _lciIndex = lciIndex + 1;
          }
        });
      });
    });

    const NUM = showDetailsView ? 400 : 600;
    const x = NUM - _lcIndex * 200;

    let y;
    const lciMidIndex = Math.round(lciLongestLength / 2);
    const diff = lciMidIndex - _lciIndex;

    if (_lciIndex === lciMidIndex) y = 200;
    else if (_lciIndex < lciMidIndex) y = 200 - diff * 100;
    else if (_lciIndex > lciMidIndex) y = 200 + diff * 100;

    panZoomInstance.value.moveTo(x, y);
  });
};
