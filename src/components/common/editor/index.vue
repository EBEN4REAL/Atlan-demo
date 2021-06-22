<template>
  <div>
    <div class="m-2 w-full h-full bg-white border rounded editor">
      <editor-menu :editable="editable" :editor="editor" />
      <editor-content :editor="editor" class="px-7 py-3 rounded-b" />
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

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
    }
  },
  setup() {
    const editor = useEditor({
      content: `<h2>
    Hi there,
  </h2>
  <p>
    this is a basic <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
  </p>
  <ul>
    <li>
      That’s a bullet list with one …
    </li>
    <li>
      … or two list items.
    </li>
  </ul>
  <p>
    Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
  </p>
  <pre><code class="language-css">body {
  display: none;
}</code></pre>
  <p>
    I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
  </p>
  <blockquote>
    Wow, that’s amazing. Good work, boy! 👏
    <br />
    — Mom
  </blockquote>`,
      extensions: [StarterKit, Underline, Link],
    });

    return { editor };
  },
});
</script>

<style lang="less" >
.editor {
  position: relative;
  max-width: 100%;
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