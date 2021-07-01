<template>
  <div class="mx-2 w-full h-full bg-white border editor">
    <editor-menu :editable="editable" :editor="editor" />

    <bubble-menu key="imageWidth" :editor="editor" v-if="editor" @blur="showImageBubble = false">
      <div
        class="bg-white py-3 px-5 w-48 shadow-xl rounded flex flex-col"
        v-if="editable && showImageBubble"
      >
        <a-radio-group class="flex flex-col" v-model:value="widthOption">
          <a-radio :value="1">Orignal Size</a-radio>
          <div class="pt-4 flex flex-col">
            <a-radio class="pb-2" :value="2">Width</a-radio>
            <div class="p-0 m-0 flex">
              <a-input-number
                class="ml-2 w-48 rounded-r-none"
                :min="5"
                :max="200"
                :disabled="widthOption === 1"
                v-model:value="customWidth"
              />
              <span class="border-gray-300 border border-l-0 pt-1.5 px-1 h-8">
                %
              </span>
            </div>
            <div class="ml-2 flex justify-between text-xs text-gray-400">
              <span class="">Min: 5</span><span>Max: 200</span>
            </div>
          </div>
        </a-radio-group>
        <a-button
          class="mt-4"
          type="primary"
          @click="() => applyImageWidth(editor)"
          >Apply</a-button
        >
      </div>
    </bubble-menu>

    <!-- <bubble-menu key="selectionMenu" :editor="editor" v-if="editor">
      <selection-menu :editor="editor" :editable="editable" />
    </bubble-menu> -->


    <editor-content :editor="editor" class="px-7 py-3 rounded-b" />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent, ref, watch, computed } from "vue";
import { useDebounceFn } from "@vueuse/core";

import {
  useEditor,
  EditorContent,
  BubbleMenu,
  Editor,
  VueRenderer,
} from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from '@tiptap/extension-highlight'

import EditorMenu from "./editorMenu.vue";
import SelectionMenu from "./selectionMenu.vue";
import SlashCommands from "./extensions/slashCommands/commands";

import LinkPreview from "./extensions/linkPreview/linkPreview";

export default defineComponent({
  components: {
    EditorContent,
    BubbleMenu,
    EditorMenu,
    SelectionMenu
  },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "Add some details here...",
    },
    content: {
      type: String,
      default: "",
    },
  },
  events: ["onEditorContentUpdate"],
  setup(props, { emit }) {
    const showImageBubble = ref(false);
    const widthOption = ref(1);
    const customWidth = ref(100);
    const editable = computed(() => props.editable);

    const debouncedEmit = useDebounceFn(
      (content: string, json: Record<string, any>) => {
        emit("onEditorContentUpdate", content, json);
      },
      200
    );

    const CustomImage = Image.extend({
      addAttributes() {
        return {
          ...this.parent?.(),
          imageWidth: {
            default: 100,
            renderHTML: (attributes) => {
              return {
                imageWidth: attributes.imageWidth,
              };
            },
          },
          style: {
            default: null,
            renderHTML: (attributes) => {
              return {
                style: `width: ${attributes.imageWidth}% !important; ${
                  attributes.style ? attributes.style : ""
                }`,
              };
            },
          },
        };
      },
      priority: 10000,
    });

    const applyImageWidth = (editor: Editor) => {
      const { node } = editor.state.selection;
      if (node && node.type.name === "image") {
        // node.attrs.style = `width: ${
        //   widthOption.value === 1 ? 100 : customWidth.value
        // }% !important; height: auto !important;`;
        for (let i = 1; i >= 0; i--) {
          let transaction = editor.state.tr;

          const currentCursorPosition = transaction.selection.from;
          node.attrs.imageWidth =
            widthOption.value === 1 ? 100 : customWidth.value;

          transaction = transaction.setNodeMarkup(
            currentCursorPosition,
            undefined,
            {
              ...node.attrs,
            }
          );

          const state = editor.state.apply(transaction);
          editor.view.updateState(state);
          editor.view.dispatch(transaction);
        }
      }
    };
    // <p style="text-align: center">https://cdn.britannica.com/22/206222-131-E921E1FB/Domestic-feline-tabby-cat.jpg</p><img src='https://cdn.britannica.com/22/206222-131-E921E1FB/Domestic-feline-tabby-cat.jpg' imagewidth='30'/>
    const editor = useEditor({
      content: props.content,
      editable: false,
      extensions: [
        StarterKit,
        Underline,
        Link,
        TaskList,
        TaskItem,
        CustomImage.configure({
          inline: true,
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Placeholder.configure({
          placeholder: props.placeholder,
          showOnlyWhenEditable: false,
        }),
        SlashCommands,
        LinkPreview,
        Highlight.configure({ multicolor: true })
      ],
      onUpdate({ editor }) {
        const content = editor.getHTML();
        const json = editor.getJSON();
        console.log(content)
        debouncedEmit(content, json);
      },
      onSelectionUpdate({ editor }) {
        const { node } = editor.state.selection;
        if (node && node.type.name === "image") {
          widthOption.value = node.attrs.imageWidth === 100 ? 1 : 2;
          customWidth.value = node.attrs.imageWidth;

          showImageBubble.value = true;
        } else {
          showImageBubble.value = false;
        }
      },
    });

    const resetEditor = () => {
      editor.value?.chain().setContent(props.content).run();
    };
    const applyTemplate = (content: string) => {
            editor.value?.chain().setContent(content).run();
    }
      const getEditorContent = () => {
         const content = editor.value.getHTML();
        const json = editor.value.getJSON();
        return { content, json }
      }

    watch(editable, (newEditable) => {
      editor.value?.setEditable(newEditable);
      console.log(editor.value?.extensionManager.extensions);
    });
    // watch(customWidth, (width) => {
    //   if (editor.value) {
    //     let transaction = editor.value.state.tr;
    //     const { node } = transaction.selection;
    //     if (node && node.type.name === "image") {
    //       const currentCursorPosition = transaction.selection.from;
    //       // node.attrs.style = `width: ${
    //       //   widthOption.value === 1 ? 100 : customWidth.value
    //       // }% !important; height: auto !important;`;
    //       node.attrs.imageWidth = widthOption.value === 1 ? 100 : width;

    //       transaction = transaction?.setNodeMarkup(
    //         currentCursorPosition,
    //         undefined,
    //         {
    //           ...node.attrs,
    //         }
    //       );
    //       console.log(transaction);
    //       editor.value.view.dispatch(transaction);
    //       editor.value.state.apply(transaction);

    //     }
    //   }
    // });
    return {
      editor,
      showImageBubble,
      widthOption,
      customWidth,
      applyImageWidth,
      resetEditor,
      applyTemplate,
      getEditorContent
    };
  },
});
</script>

<style lang="less" >
.editor {
  position: relative;
  min-width: inherit;
  max-width: inherit;
}

.ProseMirror {
  strong {
    font-family: "Avenir-heavy" !important;
    // @apply font-black text-black !important;
  }
  img {
    display: inline-block;
  }
  .ProseMirror-selectednode {
    outline: 1px dashed #3b82f6 !important;
  }
  ul {
    @apply list-disc;

    &[data-type="taskList"] {
      list-style-type: none;
      @apply p-0 m-0;

      li {
        @apply p-0 m-0 flex align-middle;

        label {
          @apply my-1 mr-2 flex align-middle;
        }
        div {
          @apply p-0 m-0 flex align-middle;
        }
      }
    }
  }
  ol {
    @apply list-decimal;
  }

  blockquote {
    @apply m-0;
    border-left: 2px solid rgba(#161515, 0.1) !important;

    p {
      @apply p-2 bg-gray-50 rounded !important;
    }
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  h1 {
    @apply text-3xl;
  }
  h2 {
    @apply text-2xl;
  }
  h3 {
    @apply text-lg;
  }
  p.is-empty::before {
    content: "Type '/' for commands";
    float: left;
    pointer-events: none;
    height: 0;
    @apply text-gray-400;
  }
  p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    pointer-events: none;
    height: 0;
    @apply text-gray-400;
  }
}
</style>