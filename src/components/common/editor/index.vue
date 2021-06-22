<template>
    <div class="mx-2 w-full h-full bg-white border  editor">
      <editor-menu :editable="editable" :editor="editor" />
      <editor-content :editor="editor" class="px-7 py-3 rounded-b" />
    </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
// import Link from "@tiptap/extension-link";

import EditorMenu from "./editorMenu.vue";

export default defineComponent({
  components: {
    EditorContent,
    BubbleMenu,
    EditorMenu,
  },
  props:{
    editable: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: 'Add some details here',
    }
  },
  setup(props) {
    const editor = useEditor({
      content: `${props.placeholder}`,
      extensions: [StarterKit, Underline],
    });

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