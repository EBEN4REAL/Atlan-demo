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
      <div v-if="editable" class="flex align-items-center">
        <a-button
          type="link"
          :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700'"
          :loadingText="'Updating...'"
          iconMargin="mr-0"
          ><fa icon="fal save"></fa> Save</a-button
        >
        <a-button
          type="link"
          :variant="'btn btn-sm btn-link mb-0 btn-no-focus font-w700'"
          :loadingText="'Updating...'"
          iconMargin="mr-0"
          @click="saveAsTemplate"
          ><fa icon="fal save"></fa> Save as template</a-button
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
    <div v-if="templateList.length && editable" class="ml-2 p-1 flex bg-white">
      <a-button
        v-for="template in templateList"
        :key="template.name"
        class="mr-2"
        @click="() => applyTemplate(template)"
      >
        {{ template.name }}
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
      default: "",
    },
  },
  setup() {
    const editable = ref(false);
    const editor = ref();
    const editorContent = ref('');

    const templateList = ref([
      {
        name: "Feature Request",
        content:
          '<h1>What is the request?</h1><p><strong>Tell us more</strong></p><ul><li><p>Mention the pain point, not just the suggestion and solution</p><p><strong>Customers who have requested similar features</strong></p></li><li><p>Add any wingman calls if possible</p></li></ul><p></p><p></p><p><strong>Any other product which has a similar feature?</strong></p><p><mark data-color="#bfdbfe" style="background-color: #bfdbfe">Lorem ipsum dolar</mark></p>',
      },
    ]);

    const onUpdate = (content: string, json: Record<string, any>) => {
      // console.log(content, json)
      editorContent.value = content;
    };

    const onCancel = () => {
      if (editor.value) {
        editor.value.resetEditor();
      }
      editable.value = false;
    };

    const applyTemplate = (template) => {
      if (editor.value) {
        editor.value.applyTemplate(template.content);
      }
    };

    const saveAsTemplate = () => {
      templateList.value.push({
        name: `Template 1`,
        content: editorContent.value
      })
    }

    return {
      editable,
      editor,
      templateList,
      onUpdate,
      onCancel,
      applyTemplate,
      saveAsTemplate
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

