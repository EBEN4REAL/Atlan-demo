<template>
  <div>
    <div class="m-2 font-bold bg-white border rounded editor">
      <!-- <div v-if="editor" class="sticky top-0 max-w-full overflow-x-scroll">
      <a-button-group>
        <a-button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
            <fa icon="fa bold" class="mr-2" />
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <fa icon="fa italic"></fa>
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <fa icon="fa strikethrough"></fa>
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
        >
          <fa icon="fa code"></fa>
        </a-button>
        <a-button @click="editor.chain().focus().unsetAllMarks().run()">
          clear marks
        </a-button>
        <a-button @click="editor.chain().focus().clearNodes().run()">
          clear nodes
        </a-button>
        <a-button
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          <fa icon="fa paragraph"></fa>
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          h1
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          h2
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          h3
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        >
          h4
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        >
          h5
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        >
          h6
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <fa icon="fa list-ul"></fa>
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <fa icon="fa list-ol"></fa>
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
        >
          code block
        </a-button>
        <a-button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
        >
          blockquote
        </a-button>
        <a-button @click="editor.chain().focus().setHorizontalRule().run()">
          horizontal rule
        </a-button>
        <a-button @click="editor.chain().focus().setHardBreak().run()">
          hard break
        </a-button>
        <a-button @click="editor.chain().focus().undo().run()"> undo </a-button>
        <a-button @click="editor.chain().focus().redo().run()"> redo </a-button>
      </a-button-group>
    </div> -->
      <editor-menu :editor="editor" />
      <editor-content :editor="editor" class="px-5" />
    </div>
  </div>
</template>
  
  <script lang="ts">
import { defineComponent } from "vue";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import EditorMenu from "./editorMenu.vue";

export default defineComponent({
  components: {
    EditorContent,
    BubbleMenu,
    EditorMenu,
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
      extensions: [StarterKit, Underline],
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

    p {
      @apply p-2 bg-gray-100 rounded;
    }
  }
}
</style>