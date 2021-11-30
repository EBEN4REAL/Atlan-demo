<template>
    <div class="w-full h-full bg-white editor">
        <bubble-menu
            v-if="!editor?.isActive('uploadimage') && editor"
            class="w-full bubble-menu"
            :tippy-options="{
                duration: 100,
                zIndex: 1,
                placement: 'top-start',
            }"
            :editor="editor"
        >
            <selection-menu :editor="editor" :editable="isEditMode" />
        </bubble-menu>

        <editor-content :editor="editor" class="mb-4" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs } from 'vue'
    import { useDebounceFn, useVModels } from '@vueuse/core'

    import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Underline from '@tiptap/extension-underline'
    import Link from '@tiptap/extension-link'
    import TaskList from '@tiptap/extension-task-list'
    import TaskItem from '@tiptap/extension-task-item'
    import TextAlign from '@tiptap/extension-text-align'
    import Placeholder from '@tiptap/extension-placeholder'
    import Image from '@tiptap/extension-image'

    import Highlight from '@tiptap/extension-highlight'

    import Document from '@tiptap/extension-document'

    import SelectionMenu from './selectionMenu.vue'
    // import SlashCommands from './extensions/slashCommands/commands'
    import ImageUpload from './extensions/imageUpload/extension'

    import LinkPreview from './extensions/linkPreview/linkPreview'

    const CustomDocument = Document.extend({
        content: 'heading block*',
    })

    export default defineComponent({
        components: {
            EditorContent,
            BubbleMenu,
            SelectionMenu,
        },
        props: {
            isEditMode: {
                type: Boolean,
                default: false,
            },
            placeholder: {
                type: String,
                default: '',
            },
            modelValue: {
                type: String,
                default: ``,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const showImageBubble = ref(false)
            const widthOption = ref(1)
            const customWidth = ref(100)

            const { isEditMode } = toRefs(props)
            const { modelValue } = useVModels(props, emit)

            const localModelValue = ref(modelValue.value)

            const debouncedEmit = useDebounceFn((content: string) => {
                console.log(content)
                modelValue.value = content
                emit('change')
            }, 500)

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
                content: localModelValue.value,
                editable: isEditMode.value,
                editorProps: {
                    attributes: {
                        class: 'prose prose-sm w-full',
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
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    }),

                    LinkPreview,
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

                    debouncedEmit(content)
                },
            })

            const resetEditor = (content) => {
                editor.value?.chain().setContent(content).run()
            }
            const applyTemplate = (content: string) => {
                editor.value?.chain().setContent(content).run()
            }
            const getEditorContent = () => {
                const content = editor.value?.getHTML()
                const json = editor.value?.getJSON()
                return { content, json }
            }

            watch(isEditMode, () => {
                editor.value?.setEditable(isEditMode.value)
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
        min-height: 10vh;
        min-width: inherit;
        max-width: inherit;
    }
</style>
