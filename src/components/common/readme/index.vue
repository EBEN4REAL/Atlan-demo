<template>
  <div class="readme-wrapper w-2/3 h-min-1/2">
    <div
      class="
        ml-2
        py-2
        px-7
        flex
        justify-between
        text-lg
        w-full
        border
        bg-white
        rounded-t
      "
    >
      <div>README</div>
      <div v-if="editable" class="d-flex align-items-center">
        <a-button
          type="link"
          :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700'"
          :loadingText="'Updating...'"
          iconMargin="mr-0"
          ><fa icon="fal save"></fa> Save</a-button
        >
        <a-button
          type="link"
          :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700 text-muted'"
          @click="onCancel"
          :loading="false"
          :loadingText="'Cancelling...'"
          >Cancel</a-button
        >
      </div>
      <a-button v-else type="link" class="text-sm" @click="editable = true">
        <fa icon="fa pencil" class="mx-2 text-xs" />
        Edit
      </a-button>
    </div>
    <Editor
      @onEditorContentUpdate="onUpdate"
      ref="editor"
      :placeholder="placeholder"
      class="rounded-t-none"
      :editable="editable"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

import Editor from "@/common/editor/index.vue";

export default defineComponent({
  components: {
    Editor,
  },
  props: {
    placeholder: {
      type: String,
      default: "Add some details here...",
    },
    parentAssetId: {
      type: String,
      required: true,
      default: ''
    }
  },
  setup() {
    const editable = ref(false);
    const editor = ref();

    const onUpdate = (content: string, json: Record<string, any>) => {
      // console.log(content, json)
    };

    const onCancel = () => {
      if (editor.value) {
        editor.value.resetEditor();
      }
      editable.value = false;
    };

    return {
      editable,
      editor,
      onUpdate,
      onCancel,
    };
  },
});
</script>

<style lang="less">
.container {
  display: flex;
  width: 100vw !important;
  align-items: center;
}
</style>

<route lang="yaml">
  meta:
    layout: project
    requiresAuth: true
</route>

