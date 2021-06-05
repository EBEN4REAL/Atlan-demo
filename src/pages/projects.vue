<template>
<div class="flex flex-col h-full">
<div class="flex px-3 py-2 bg-white border-b border-gray-100">
<a-select
  placeholder="Project"
  style="width: 120px"
>
  <a-select-option value="jack">Jack</a-select-option>
  <a-select-option value="lucy">Lucy</a-select-option>
  <a-select-option value="disabled" disabled>Disabled</a-select-option>
  <a-select-option value="Yiminghe">yiminghe</a-select-option>
</a-select>
</div>
<div class="flex-grow">
  <splitpanes class="h-full default-theme">
    <pane :size="25" class="px-3 bg-white"> 
      <div class="flex mt-3 space-x-2">
      <a-input-search></a-input-search>
      <a-button type="primary"><fa icon="fal plus"></fa></a-button>
    </div>
      <a-tabs>
        <a-tab-pane key="1" tab="Tab 1">Menu</a-tab-pane>
        <a-tab-pane key="2" tab="Tab 2">Assets</a-tab-pane>
      </a-tabs>

    </pane>
    <pane :size="75">
      <Editor></Editor>

    </pane>
  </splitpanes>
</div>

</div>
 
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent } from "vue";




export default defineComponent({
  components: {
    Editor: defineAsyncComponent(() =>
      import('@common/editor/index.vue')
    )
  }
});
</script>

<route lang="yaml">
    meta:
      layout: default
      requiresAuth: true
</route>