<template>
  <node-view-wrapper class="vue-component">
    <div class="content">
      <SQLEditor contenteditable="false"></SQLEditor>
    </div>
  </node-view-wrapper>
</template>
  
<script lang="ts">
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import { defineComponent } from "vue";
import SQLEditor from "@common/sqleditor/index.vue";

export default defineComponent({
  components: {
    NodeViewWrapper,
    SQLEditor,
  },
  props: nodeViewProps,
  methods: {
    increase() {
      this.updateAttributes({
        count: this.node.attrs.count + 1,
      });
    },
  },
});
</script>
  
<style lang="less" scoped>
.vue-component {
  background: #faf594;
  border: 3px solid #0d0d0d;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

.label {
  margin-left: 1rem;
  background-color: #0d0d0d;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
}

.content {
  margin-top: 1.5rem;
  padding: 1rem;
}
</style>