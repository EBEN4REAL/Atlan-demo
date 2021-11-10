<template>
    <div class="w-full h-full bg-white editor">
        <bubble-menu
            class="bubble-menu"
            :tippy-options="{
                duration: 100,
                zIndex: 1,
                placement: 'top-start',
            }"
            :editor="editor"
            v-if="editor"
        >
            <selection-menu :editable="editable" :editor="editor" />
        </bubble-menu>

        <editor-content :editor="editor" class="mb-4" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, computed } from 'vue'
    import { useDebounceFn } from '@vueuse/core'

    import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Underline from '@tiptap/extension-underline'
    import Link from '@tiptap/extension-link'
    import TaskList from '@tiptap/extension-task-list'
    import TaskItem from '@tiptap/extension-task-item'
    import TextAlign from '@tiptap/extension-text-align'
    import Placeholder from '@tiptap/extension-placeholder'
    import TableExtension from '@tiptap/extension-table'
    import TableRow from '@tiptap/extension-table-row'
    import TableHeader from '@tiptap/extension-table-header'
    import TableCell from '@tiptap/extension-table-cell'

    import Gapcursor from '@tiptap/extension-gapcursor'

    import Image from '@tiptap/extension-image'

    import Highlight from '@tiptap/extension-highlight'

    import Document from '@tiptap/extension-document'

    import EditorMenu from './editorMenu.vue'
    import SelectionMenu from './selectionMenu.vue'
    import SlashCommands from './extensions/slashCommands/commands'
    import ImageUpload from './extensions/imageUpload/extension'

    import LinkPreview from './extensions/linkPreview/linkPreview'

    const CustomDocument = Document.extend({
        content: 'heading block*',
    })

    export default defineComponent({
        components: {
            EditorContent,
            BubbleMenu,
            EditorMenu,
            SelectionMenu,
        },
        props: {
            editable: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '',
            },
            content: {
                type: String,
                default: `<h1>Try to move the cursor after the image with your arrow keys! You should see a</h1>
        <image-upload src="https://source.unsplash.com/8xznAGy4HcY/800x400" />`,
            },
        },
        events: ['onEditorContentUpdate'],
        setup(props, { emit }) {
            const showImageBubble = ref(false)
            const widthOption = ref(1)
            const customWidth = ref(100)
            const editable = computed(() => props.editable)

            const debouncedEmit = useDebounceFn(
                (content: string, json: Record<string, any>) => {
                    emit('onEditorContentUpdate', content, json)
                },
                500
            )

            const CustomImage = Image.extend({
                addAttributes() {
                    return {
                        ...this.parent?.(),
                        imageWidth: {
                            default: 100,
                            renderHTML: (attributes) => ({
                                imageWidth: attributes.imageWidth,
                            }),
                        },
                        style: {
                            default: null,
                            renderHTML: (attributes) => ({
                                style: `width: ${
                                    attributes.imageWidth
                                }% !important; ${
                                    attributes.style ? attributes.style : ''
                                }`,
                            }),
                        },
                    }
                },
                priority: 10000,
            })

            const applyImageWidth = (editor: Editor) => {
                const { node } = editor.state.selection
                if (node && node.type.name === 'image') {
                    // node.attrs.style = `width: ${
                    //   widthOption.value === 1 ? 100 : customWidth.value
                    // }% !important; height: auto !important;`;
                    for (let i = 1; i >= 0; i--) {
                        let transaction = editor.state.tr

                        const currentCursorPosition = transaction.selection.from
                        node.attrs.imageWidth =
                            widthOption.value === 1 ? 100 : customWidth.value

                        transaction = transaction.setNodeMarkup(
                            currentCursorPosition,
                            undefined,
                            {
                                ...node.attrs,
                            }
                        )

                        const state = editor.state.apply(transaction)
                        editor.view.updateState(state)
                        editor.view.dispatch(transaction)
                    }
                }
            }

            const editor = useEditor({
                content: props.content,
                editable: false,
                editorProps: {
                    attributes: {
                        class: 'prose prose-sm focus:outline-none w-full',
                    },
                },
                extensions: [
                    CustomDocument,
                    StarterKit.configure({
                        document: false,
                    }),
                    Underline,
                    Link,
                    TaskList,
                    TaskItem,
                    Gapcursor,
                    Image,
                    // CustomImage.configure({
                    //     inline: true,
                    // }),
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    }),

                    SlashCommands,
                    LinkPreview,
                    TableExtension.configure({
                        resizable: true,
                    }),
                    TableRow,
                    TableCell,
                    TableHeader,
                    ImageUpload,
                    Highlight.configure({ multicolor: true }),
                    Placeholder.configure({
                        placeholder: ({ node }) => {
                            if (node.type.name === 'heading') {
                                return 'Readme Title'
                            }

                            return props.placeholder
                        },
                        showOnlyWhenEditable: false,
                    }),
                ],
                onUpdate({ editor }) {
                    const content = editor.getHTML()
                    const json = editor.getJSON()
                    debouncedEmit(content, json)
                },
                onSelectionUpdate({ editor }) {
                    const { node } = editor.state.selection
                    if (node && node.type.name === 'image') {
                        widthOption.value =
                            node.attrs.imageWidth === 100 ? 1 : 2
                        customWidth.value = node.attrs.imageWidth

                        showImageBubble.value = true
                    } else {
                        showImageBubble.value = false
                    }
                },
            })

            const resetEditor = () => {
                editor.value?.chain().setContent(props.content).run()
            }
            const applyTemplate = (content: string) => {
                editor.value?.chain().setContent(content).run()
            }
            const getEditorContent = () => {
                const content = editor.value?.getHTML()
                const json = editor.value?.getJSON()
                return { content, json }
            }

            watch(editable, (newEditable) => {
                editor.value?.setEditable(newEditable)
            })

            return {
                editor,
                showImageBubble,
                widthOption,
                customWidth,
                applyImageWidth,
                resetEditor,
                applyTemplate,
                getEditorContent,
            }
        },
    })
</script>

<style lang="less">
    .editor {
        position: relative;
        min-height: 15vh;
        min-width: inherit;
        max-width: inherit;
    }

    .ProseMirror {
        strong {
            font-family: 'Avenir-heavy' !important;
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

            &[data-type='taskList'] {
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
                @apply p-2 bg-gray-100 rounded !important;
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
            @apply text-gray;
        }
        p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            pointer-events: none;
            height: 0;
            @apply text-gray-500;
        }
    }
</style>
