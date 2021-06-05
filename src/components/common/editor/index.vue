<template>
    <div class="bg-white border rounded">

        <bubble-menu :editor="editor" v-if="editor">
            <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
              bold
            </button>
            <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
              italic
            </button>
            <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
              strike
            </button>
          </bubble-menu>
    <div v-if="editor">
        <a-button-group>
        <a-button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
          <fa icon="fa bold"></fa>
        </a-button>
        <a-button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
            <fa icon="fa italic"></fa>
        </a-button>
        <a-button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
            <fa icon="fa strikethrough"></fa>
        </a-button>
        <a-button @click="editor.chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
            <fa icon="fa code"></fa>
        </a-button>
        <a-button @click="editor.chain().focus().unsetAllMarks().run()">
          clear marks
        </a-button>
        <a-button @click="editor.chain().focus().clearNodes().run()">
          clear nodes
        </a-button>
        <a-button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
            <fa icon="fa paragraph"></fa>
        </a-button>
        <a-button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
          h1
        </a-button>
        <a-button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
          h2
        </a-button>
        <a-button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
          h3
        </a-button>
        <a-button @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }">
          h4
        </a-button>
        <a-button @click="editor.chain().focus().toggleHeading({ level: 5 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }">
          h5
        </a-button>
        <a-button @click="editor.chain().focus().toggleHeading({ level: 6 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }">
          h6
        </a-button>
        <a-button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
          bullet list
        </a-button>
        <a-button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
          ordered list
        </a-button>
        <a-button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
          code block
        </a-button>
        <a-button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
          blockquote
        </a-button>
        <a-button @click="editor.chain().focus().setHorizontalRule().run()">
          horizontal rule
        </a-button>
        <a-button @click="editor.chain().focus().setHardBreak().run()">
          hard break
        </a-button>
        <a-button @click="editor.chain().focus().undo().run()">
          undo
        </a-button>
        <a-button @click="editor.chain().focus().redo().run()">
          redo
        </a-button>
    </a-button-group>
      </div>
    <editor-content :editor="editor" />
</div>
  </template>
  
  <script lang="ts">
import { defineComponent } from "vue";
  import { Editor, EditorContent,BubbleMenu } from "@tiptap/vue-3"
  import StarterKit from "@tiptap/starter-kit"
  
  export default defineComponent({
    components: {
      EditorContent,
      BubbleMenu,
    },
  
    data() {
      return {
        editor: null,
      }
    },
  
    mounted() {
      this.editor = new Editor({
        content: '<p>I’m running tiptap with Vue.js. 🎉</p>',
        extensions: [
          StarterKit,
        ],
      })
    },

    beforeUnmount() {
      this.editor.destroy()
    },
  });
  </script>