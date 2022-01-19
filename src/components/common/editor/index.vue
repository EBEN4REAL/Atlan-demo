<template>
    <div class="w-full h-full bg-white editor">
        <bubble-menu
            v-if="!editor?.isActive('uploadimage') && editor"
            class="w-full bubble-menu"
            :tippy-options="{
                duration: 100,
                zIndex: 1,
                placement: 'top-start',
                maxWidth: 'none',
                animation: 'fade',
            }"
            :editor="editor"
        >
            <selection-menu :editor="editor" :editable="isEditMode" />
        </bubble-menu>
        <bubble-menu
            v-if="!editor?.isActive('uploadimage') && editor?.isActive('customTable') && editor"
            class="w-full bubble-menu"
            :tippy-options="{
                duration: 100,
                zIndex: 1,
                placement: 'top-end',
                maxWidth: 'none',
                animation: 'fade',
                trigger: 'click'
            }"
            :editor="editor"
        >
            <selection-menu-table :editor="editor" :editable="isEditMode" />
        </bubble-menu>

        <editor-content :editor="editor" class="mb-4" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs, computed } from 'vue'
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

    import Table from '@tiptap/extension-table'
    import TableRow from '@tiptap/extension-table-row'
    import TableHeader from '@tiptap/extension-table-header'
    import TableCell from '@tiptap/extension-table-cell'
    import { CustomTable } from '@common/editor/extensions/table/extension'

    import SelectionMenu from './selectionMenu.vue'
    import SelectionMenuTable from './selectionMenuTable.vue'
    import SlashCommands from './extensions/slashCommands/commands'
    import suggestion from './extensions/slashCommands/suggestion'
    import ImageUpload from './extensions/imageUpload/extension'

    import LinkPreview from './extensions/linkPreview/linkPreview'

    export default defineComponent({
        components: {
            EditorContent,
            BubbleMenu,
            SelectionMenu,
            SelectionMenuTable
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

            const selectedRowIndex = ref(0)
            const selectedColIndex = ref(0)

            const { isEditMode } = toRefs(props)
            const { modelValue } = useVModels(props, emit)

            const localModelValue = ref(decodeURIComponent(modelValue.value))

            const debouncedEmit = useDebounceFn((content: string) => {
                modelValue.value = encodeURIComponent(content)
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
                    // handleClick(view, pos) {
                    //     const getBlock = view.domAtPos(pos)
                    //
                    //     let isTableCell = false
                    //     let { parentElement } = getBlock.node
                    //     while (parentElement !== null) {
                    //         if (parentElement.nodeName === "TD" || parentElement.nodeName === "TH") {
                    //             isTableCell = true
                    //             break
                    //         }
                    //         parentElement = parentElement.parentElement
                    //     }
                    //
                    //     if (isTableCell && (parentElement?.nodeName === "TD" || parentElement?.nodeName === "TH") && parentElement?.parentElement?.nodeName === "TR") {
                    //         parentElement?.parentElement?.classList.add("something")
                    //         selectedColIndex.value = parentElement?.cellIndex
                    //         selectedRowIndex.value = parentElement?.rowIndex
                    //     }
                    //
                    //     return true
                    // }
                },
                autofocus: true,
                extensions: [
                    StarterKit,
                    Underline,
                    Link,
                    TaskList,
                    TaskItem,
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    }),
                    SlashCommands.configure({
                        suggestion
                    }),
                    LinkPreview,
                    ImageUpload,
                    Highlight.configure({ multicolor: true }),
                    Placeholder.configure({
                        placeholder: ({ node }) => node.type.name === 'codeBlock' ? "Go ahead. Type some geek..." : props.placeholder,
                        showOnlyWhenEditable: true
                    }),
                    CustomTable.extend({
                        addKeyboardShortcuts() {
                            return {
                                'Tab': () => this.editor.commands.goToNextCell()
                            }
                        }
                    }).configure({
                        resizable: false
                    }),
                    TableRow,
                    TableHeader.configure({
                        HTMLAttributes: {
                            class: 'border border-l-gray-500 px-3 py-1 text-bold text-sm bg-gray-100'
                        }
                    }),
                    TableCell.configure({
                        HTMLAttributes: {
                            class: 'border border-l-gray-500 px-3 py-1 text-sm',
                        }
                    }),
                ],
                onUpdate({ editor: currEditor }) {
                    const content = currEditor.getHTML()
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

            const shouldShowLegacyMenu = ({ editor: currEditor, view, state, oldState, from, to })  => {
                // only show the bubble menu for images and links
                return from !== to
            }

            const shouldShowTableMenu = ({ editor: currEditor, view, state, oldState, from, to })  => {
                // only show the bubble menu for images and links
                return (currEditor.isActive('table') && from === to)
            }

            return {
                editor,
                showImageBubble,
                widthOption,
                customWidth,
                applyImageWidth,
                resetEditor,
                applyTemplate,
                getEditorContent,
                shouldShowLegacyMenu,
                shouldShowTableMenu
            }
        },
    })
</script>

<style lang="less" scoped>
    .editor {
        position: relative;
        min-width: inherit;
        max-width: inherit;
    }

    .table-wrapper {
        padding: 1rem 0;
        overflow-x: auto;
    }
</style>
