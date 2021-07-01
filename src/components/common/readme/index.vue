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
        class="mr-2"
          >Save</a-button
        >
        <a-button
          @click="saveAsTemplate"
          >{{ templateName === '' ? 'Save as template' : 'Save as a new template'}}</a-button
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
      <a-button v-else type="link" class="text-sm" @click="startEdit">
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
    <a-modal
      class="border-gray-700 mt-16"
      :visible="showTemplatesModal"
      :title="null"
      :closable="true"
      :mask="true"
      :maskClosable="true"
      width="50vw"
      :footer="null"
      @cancel="() => (showTemplatesModal = false)"
    >
      <div
        v-if="templateList.length && editable"
        class="p-1 pl-0 flex flex-col bg-white"
      >
        <div class="flex justify-between p-2">
          <span class="text-2xl">Readme Templates</span>
          <div>
            <a-button type="default" class="rounded-2">New Template</a-button>
            <!-- <a-button type="link" @click="editTemplates">Edit</a-button> -->
          </div>
        </div>
        <hr />
        <div class="flex flex-col mt-4">
          <div
            v-for="template in templateList"
            :key="template.name"
            class="mx-2 flex justify-between mt-4"
          >
            <span class="text-lg">{{ template.name }}</span>
            <div class="flex">
              <a-button
                class="rounded-2"
                @click="() => applyTemplate(template)"
              >
                Get Started
              </a-button>
            </div>
          </div>
          <div class="text-xs mt-16 ml-2">
            Don't want to use a template?
            <a-button type="link" @click="startBlank">Start blank -></a-button>
          </div>
        </div>
      </div>
    </a-modal>
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
    const editorContent = ref("");
    const showTemplatesModal = ref(false);
    const templateName = ref("");

    const templateList = ref([
      {
        name: "Feature Request",
        content:
          '<h1>What is the request?</h1><p><strong>Tell us more</strong></p><ul><li><p>Mention the pain point, not just the suggestion and solution</p><p><strong>Customers who have requested similar features</strong></p></li><li><p>Add any wingman calls if possible</p></li></ul><p></p><p></p><p><strong>Any other product which has a similar feature?</strong></p><p><mark data-color="#bfdbfe" style="background-color: #bfdbfe">Lorem ipsum dolar</mark></p>',
      },
      {
        name: "Bug Report",
        content:
          "<h1>What is the Bug?</h1><p><strong>Tell us more</strong></p><ul><li><p>Mention how to reproduce the bug</p><p><strong>Screenshots</strong></p></li></ul><p></p>",
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
      editorContent.value = editor.value.getEditorContent().content;

      editable.value = false;
    };

    const applyTemplate = (template) => {
      if (editor.value) {
        editor.value.applyTemplate(template.content);
        showTemplatesModal.value = false;
        templateName.value = template.name;
      }
    };

    const saveAsTemplate = () => {
      templateList.value.push({
        name: `Template 1`,
        content: editorContent.value,
      });
    };

    const startEdit = () => {
      editable.value = true;
      if (!editorContent.value || editorContent.value==='<p></p>') {
        showTemplatesModal.value = true;
      }
    };

    // const newTemplate = () => {

    // }
    const startBlank = () => {
      showTemplatesModal.value = false;
      templateName.value = "";
    };

    return {
      editable,
      editor,
      templateList,
      templateName,
      onUpdate,
      onCancel,
      applyTemplate,
      saveAsTemplate,
      startEdit,
      startBlank,
      showTemplatesModal,
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

