<template>
  <editor-content :editor="editor" class="flex justify-center w-full h-full" />
</template>
    
  <script lang="ts">
import { defineComponent, Ref } from "vue";

import { useEditor, EditorContent, VueRenderer } from "@tiptap/vue-3";
// import StarterKit from "@tiptap/starter-kit";

// import Heading from "@tiptap/extension-heading";

// import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// // import { lowlight } from "lowlight";
// import { lowlight } from "lowlight";
// import { VueNodeViewRenderer } from "@tiptap/vue-3";

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Typography from "@tiptap/extension-typography";
import SQL from "@/projects/sql/extension";
import Commands from "@/projects/commands/extension";
import tippy from "tippy.js";
import CommandsList from "@/projects/commands/index.vue";
import History from "@tiptap/extension-history";

export default defineComponent({
  components: {
    EditorContent,
  },
  setup(props, context) {
    const editor = useEditor({
      content: `<p>Title</p><sql></sql><p>asdad</p>`,
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-md xl:prose-lg pt-12 w-full focus:outline-none",
        },
      },
      extensions: [
        Document,
        Paragraph,
        Text,
        History,
        Heading.configure({
          levels: [1, 2, 3],
        }),
        Typography,
        SQL,
        Commands.configure({
          suggestion: {
            items: (query) => {
              return [
                {
                  title: "SQL",
                  command: ({ editor, range }) => {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertContent("<sql></sql>")
                      .run();
                  },
                },
                {
                  title: "H1",
                  command: ({ editor, range }) => {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .setNode("heading", { level: 1 })
                      .run();
                  },
                },
                {
                  title: "H2",
                  command: ({ editor, range }) => {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .setNode("heading", { level: 2 })
                      .run();
                  },
                },
                {
                  title: "bold",
                  command: ({ editor, range }) => {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .setMark("bold")
                      .run();
                  },
                },
                {
                  title: "italic",
                  command: ({ editor, range }) => {
                    editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .setMark("italic")
                      .run();
                  },
                },
              ]
                .filter((item) =>
                  item.title.toLowerCase().startsWith(query.toLowerCase())
                )
                .slice(0, 10);
            },
            render: () => {
              let component;
              let popup;
              return {
                onStart: (props) => {
                  component = new VueRenderer(CommandsList, {
                    parent: context,
                    editor: editor.value,
                    propsData: props,
                  });
                  popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                  });
                },
                onUpdate(props) {
                  component.updateProps(props);
                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  });
                },
                onKeyDown(props) {
                  return component.ref?.onKeyDown(props);
                },
                onExit() {
                  popup[0].destroy();
                  component.destroy();
                },
              };
            },
          },
        }),
      ],
    });

    return { editor };
  },
});
</script>
    
  <style lang="less">
/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }

  pre {
    background: #0d0d0d;
    color: #fff;
    font-family: "JetBrainsMono", monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0d0d0d, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }
}
</style>