<template>
  <div v-if="editor" class="sticky top-0 max-w-full min-w-full overflow-x-auto">
    <a-button-group>
      <a-button
        v-for="menuItem in menuData"
        :key="menuItem.key"
        :class="{ 'is-active': editor.isActive(`${menuItem.key}`) }"
        @click="() => menuItem.onClick(editor)"
      >
        <fa :icon="menuItem.icon" class="m-1" />
      </a-button>
    </a-button-group>
  </div>
</template>

<script lang="ts">
import { Editor } from "@tiptap/core";
import { defineComponent, Ref } from "vue";

interface MenuItem {
  title: string;
  key: string;
  helpText: string;
  icon: string;
  onClick: (editor: Editor) => void;
}

export default defineComponent({
  props: {
    editor: {
      required: true,
    },
  },
  setup() {
    const menuData: MenuItem[] = [
      {
        title: "Bold",
        key: "bold",
        helpText: "",
        icon: "fa bold",
        onClick: (editor) => editor.chain().focus().toggleBold().run(),
      },
      {
        title: "Italic",
        key: "italic",
        helpText: "",
        icon: "fa italic",
        onClick: (editor) => editor.chain().focus().toggleItalic().run(),
      },
      {
        title: "Underline",
        key: "underline",
        helpText: "",
        icon: "fa underline",
        onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
      },
      {
        title: "Strikethrough",
        key: "strike",
        helpText: "",
        icon: "fa strikethrough",
        onClick: (editor) => editor.chain().focus().toggleStrike().run(),
      },
      {
        title: "Paragraph",
        key: "paragraph",
        helpText: "",
        icon: "fa paragraph",
        onClick: (editor) => editor.chain().focus().createParagraphNear().run(),
      },
      {
        title: "Unordered List",
        key: "bulletList",
        helpText: "",
        icon: "fa list-ul",
        onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
      },
      {
        title: "Ordered List",
        key: "orderedList",
        helpText: "",
        icon: "fa list-ol",
        onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: "Blockquote",
        key: "blockquote",
        helpText: "",
        icon: "fa quote-left",
        onClick: (editor) => editor.chain().focus().toggleBlockquote().run(),
      },
      {
        title: "Code Block",
        key: "codeBlock",
        helpText: "",
        icon: "fa code",
        onClick: (editor) => editor.chain().focus().toggleCodeBlock({language: 'css'}).run(),
      },
      // h1,h2,h3
      //horizontal rule
      //link
      //table
      //undo
      //redo
    ];

    return {
      menuData,
    };
  },
});
</script>
<style lang="less" scoped>
.is-active{
  @apply bg-gray-600 text-white;
}
</style>