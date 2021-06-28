<template>
  <div
    v-if="editor && editable"
    class="
      mb-3
      border-b-2
      rounded-t
      sticky
      top-0
      max-w-full
      min-w-full
      editor-menu
      z-50
    "
  >
    <a-button-group class="flex flex-wrap">
      <a-popover
        placement="bottom"
        v-for="menuItem in menuData"
        :key="menuItem.key"
      >
        <a-dropdown
          v-if="menuItem.key === 'image'"
          :trigger="['click']"
          placement="bottomCenter"
        >
          <a-button
            class="border-0"
            :class="{
              'is-active': editor.isActive(`${menuItem.key}`),
              'border-r-2': menuItem.border,
            }"
            @click="() => menuItem.onClick(editor)"
          >
            <fa v-if="menuItem.icon" :icon="menuItem.icon" class="m-1" />
            <span v-else>{{ menuItem.title }}</span>
          </a-button>

          <template #overlay>
            <a-menu>
              <div class="w-96 p-3 rounded">
                <div class="d-flex align-items-center justify-content-start">
                  <label>By Url</label>
                  <div class="flex">
                    <a-input
                      type="url"
                      v-model:value="imageLink"
                      focused
                      @keydown.enter="() =>  menuItem.onClick(editor)"
                    />
                    <a-button
                      type="primary"
                      class="ml-3 mr-2"
                      @click="() =>  menuItem.onClick(editor)"
                    >
                      Add
                    </a-button>
                  </div>
                </div>
                <div
                  class="mt-3 d-flex align-items-center justify-center text-center"
                >
                  <label>OR</label>
                  <div class="mt-1">
                    <a-upload name="file">
                      <a-button>
                        Click to Upload
                      </a-button>
                    </a-upload>
                  </div>
                </div>
              </div>
            </a-menu>
          </template>
        </a-dropdown>

        <a-button
          v-else
          class="border-0"
          :class="{
            'is-active':
              editor.isActive(`${menuItem.key}`) ||
              editor.isActive(`heading`, { level: menuItem.level }) ||
              (menuItem.key.split('-')[0] === 'align' &&
                editor.isActive({ textAlign: menuItem.key.split('-')[1] })),
            'border-r-2': menuItem.border,
          }"
          @click="() => menuItem.onClick(editor)"
        >
          <fa v-if="menuItem.icon" :icon="menuItem.icon" class="m-1" />
          <span v-else>{{ menuItem.title }}</span>
        </a-button>

        <template #content>{{ menuItem.helpText || menuItem.title }}</template>
      </a-popover>
    </a-button-group>

    <a-modal
      class="border-gray-700 mt-16"
      :visible="showLinkModal"
      :title="null"
      :closable="true"
      :mask="false"
      :maskClosable="true"
      width="50vw"
      :footer="null"
      @cancel="() => (showLinkModal = false)"
    >
      <div class="d-flex align-items-center justify-content-start">
        <label>Link</label>
        <div class="flex">
          <a-input
            type="url"
            v-model:value="link"
            focused
            placeholder="https://"
            @keydown.esc="showLinkModal = false"
            @keydown.enter="() => setLink(editor)"
          />
          <a-button
            type="primary"
            class="ml-3 mr-2"
            @click="() => setLink(editor)"
          >
            Apply
          </a-button>
          <a-button
            type="default"
            v-if="editor.isActive('link')"
            @click="() => unLink(editor)"
          >
            Remove
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Editor } from "@tiptap/core";
import { defineComponent, ref } from "vue";

interface MenuItem {
  title: string;
  key: string;
  helpText: string;
  icon?: string;
  level?: number;
  border?: boolean;
  onClick: (editor: Editor) => void;
}

export default defineComponent({
  props: {
    editor: {
      required: true,
    },
    editable: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  setup() {
    const showLinkModal = ref(false);
    const showImageDropdown = ref(false);
    const imageLink = ref("");
    const link = ref("");

    const menuData: MenuItem[] = [
      {
        title: "H1",
        key: "heading-1",
        level: 1,
        helpText: "",
        onClick: (editor) =>
          editor.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        title: "H2",
        key: "heading-2",
        level: 2,
        helpText: "",
        onClick: (editor) =>
          editor.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        title: "H3",
        key: "heading-3",
        level: 3,
        border: true,
        helpText: "",
        onClick: (editor) =>
          editor.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        title: "Bold",
        key: "bold",
        helpText: "",
        icon: "fa bold",
        onClick: (editor) => {
          // editor.chain().focus().toggleBold().run()
                let transaction = editor.state.tr;
          transaction = transaction.deleteSelection();
          const state = editor.state.apply(transaction);
          },
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
        title: "Hr",
        key: "rule",
        helpText: "",
        border: true,
        onClick: (editor) => editor.chain().focus().setHorizontalRule().run(),
      },
      // {
      //   title: "Paragraph",
      //   key: "paragraph",
      //   helpText: "",
      //   icon: "fa paragraph",
      //   onClick: (editor) => editor.chain().focus().createParagraphNear().run(),
      // },
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
        border: true,
        onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
      },
      {
        title: "Align Left",
        key: "align-left",
        helpText: "",
        icon: "fa align-left",
        onClick: (editor) => editor.chain().focus().setTextAlign("left").run(),
      },
      {
        title: "Align Center",
        key: "align-center",
        helpText: "",
        icon: "fa align-center",
        onClick: (editor) =>
          editor.chain().focus().setTextAlign("center").run(),
      },
      {
        title: "Align Right",
        key: "align-right",
        helpText: "",
        icon: "fa align-right",
        border: true,
        onClick: (editor) => {
          console.log(editor.commands);
          editor.chain().focus().setTextAlign("right").run();
        },
      },
      {
        title: "Link",
        key: "link",
        helpText: "",
        icon: "fa link",
        onClick: (editor) => {
          link.value = editor.getAttributes("link").href ?? "";
          showLinkModal.value = !showLinkModal.value;
        },
      },
      {
        title: "Image",
        key: "image",
        helpText: "",
        icon: "fa file-image",
        onClick: (editor) => {
          console.log("image");
          editor
            .chain()
            .focus()
            .setImage({
              src: imageLink.value,
            })
            .run();
            imageLink.value = '';
          // link.value = editor.getAttributes("link").href ?? "";
          // showLinkModal.value = !showLinkModal.value;
        },
      },
      {
        title: "TaskList",
        key: "taskList",
        helpText: "",
        icon: "fa square",
        onClick: (editor) => editor.chain().focus().toggleTaskList().run(),
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
        border: true,
        onClick: (editor) =>
          editor.chain().focus().toggleCodeBlock({ language: "css" }).run(),
      },
      {
        title: "Undo",
        key: "undo",
        helpText: "",
        icon: "fa undo",
        onClick: (editor) => editor.chain().focus().undo().run(),
      },
      {
        title: "Redo",
        key: "redo",
        helpText: "",
        icon: "fa redo",
        onClick: (editor) => editor.chain().focus().redo().run(),
      },
      //table
    ];

    const setLink = (editor: Editor) => {
      if (link.value) {
        let url = link.value;
        if (!(url.split(":")[0] === "http" || url.split(":")[0] === "https"))
          url = `https://${url}`;

        editor.chain().setLink({ href: url }).run();
        link.value = "";
        showLinkModal.value = false;
      }
    };

    const unLink = (editor: Editor) => {
      editor.chain().focus().unsetLink().run();
      link.value = "";
    };

    return {
      menuData,
      showLinkModal,
      showImageDropdown,
      imageLink,
      link,
      setLink,
      unLink,
    };
  },
});
</script>
<style lang="less" scoped>
.is-active {
  @apply bg-gray-600 text-white;
}
.editor-menu {
  @apply bg-white opacity-100 !important;

  button {
    width: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>