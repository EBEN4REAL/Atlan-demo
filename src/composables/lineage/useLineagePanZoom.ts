import { nextTick, ref } from "vue";
import panzoom from "panzoom";

export const setPanZoomEvent = async (element, updateLines) => {
  const panStarted = ref(false);
  const panZoomInstance = ref({});

  const options = {
    zoomSpeed: 3,
    maxZoom: 0.9,
    minZoom: 0.6,
    initialZoom: 0.7,
    smoothScroll: false,
    zoomDoubleClickSpeed: 1,
  };
  await nextTick(() => {
    panZoomInstance.value = panzoom(element.value, options);

    // set event notifications
    panZoomInstance.value.on("transform", function () {
      updateLines();
    });
    panZoomInstance.value.on("panstart", function () {
      panStarted.value = true;
    });
    panZoomInstance.value.on("panend", function () {
      panStarted.value = false;
    });
  });

  return { panStarted, panZoomInstance };
};

export const pausePanZoomEvent = (val, panZoomInstance) => {
  if (val) panZoomInstance.value.pause();
  else panZoomInstance.value.resume();
};

export const handleZoom = (val, panZoomInstance) => {
  const zoomOut = ref(1);
  const zoomIn = ref(1);

  if (val === "in") [zoomOut.value, zoomIn.value] = [1, (zoomIn.value += 0.1)];
  else [zoomIn.value, zoomOut.value] = [1, (zoomOut.value -= 0.1)];

  const absZoomVal = val === "in" ? zoomIn.value : zoomOut.value;
  panZoomInstance.value.zoomTo(0, 0, absZoomVal);
};

export const handleFullscreen = (updateLines, targetEl) => {
  if (document.fullscreenElement) document.exitFullscreen();
  else targetEl.value.requestFullscreen();
  updateLines();
};
