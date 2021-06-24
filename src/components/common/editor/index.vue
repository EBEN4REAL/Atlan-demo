<template>
  <div class="mx-2 w-full h-full bg-white border editor">
    <editor-menu :editable="editable" :editor="editor" />
    <editor-content :editor="editor" class="px-7 py-3 rounded-b" />
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import { useDebounceFn } from "@vueuse/core";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import Image from '@tiptap/extension-image'

import EditorMenu from "./editorMenu.vue";

export default defineComponent({
  components: {
    EditorContent,
    BubbleMenu,
    EditorMenu,
  },
  props: {
    editable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "Add some details here",
    },
    content: {
      type: String,
      default: "",
    },
  },
  events: ["onEditorContentUpdate"],
  setup(props, { emit }) {
    const debouncedEmit = useDebounceFn((content: string) => {
      emit("onEditorContentUpdate", content);
    }, 200);

    const editor = useEditor({
      content: `${
        props.content.length ? props.content : props.placeholder
      }<p style="text-align: center">sdf</p>`,
      extensions: [
        StarterKit,
        Underline,
        Link,
        TaskList,
        TaskItem,
        Image,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ],
      onUpdate({ editor }) {
        const content = editor.getHTML();
        debouncedEmit(content);
      },
    });

    console.log(editor.value?.schema);
    return { editor };
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
}
</style>