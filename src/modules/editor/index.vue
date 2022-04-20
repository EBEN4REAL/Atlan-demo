<template>
    <div class="w-full h-full bg-white editor">
        <bubble-menu
            v-if="
                editor &&
                !BLOCK_TIPPY_MENU.some((item) => editor?.isActive(item))
            "
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
            v-if="editor && editor?.isActive('customTable')"
            class="w-full bubble-menu"
            :tippy-options="{
                duration: 100,
                zIndex: 1,
                placement: 'top-end',
                maxWidth: 'none',
                animation: 'fade',
                trigger: 'click',
            }"
            :editor="editor"
        >
            <selection-menu-table :editor="editor" :editable="isEditMode" />
        </bubble-menu>

        <editor-content :editor="editor" class="mb-4" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, toRefs, provide } from 'vue'
    import { useDebounceFn, useVModels } from '@vueuse/core'

    import { useEditor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
    import StarterKit from '@tiptap/starter-kit'
    import Underline from '@tiptap/extension-underline'
    import Link from '@tiptap/extension-link'
    import TaskList from '@tiptap/extension-task-list'
    import TaskItem from '@tiptap/extension-task-item'
    import TextAlign from '@tiptap/extension-text-align'
    import Placeholder from '@tiptap/extension-placeholder'
    import Highlight from '@tiptap/extension-highlight'

    import TableRow from '@tiptap/extension-table-row'
    import TableHeader from '@tiptap/extension-table-header'
    import TableCell from '@tiptap/extension-table-cell'
    import { CustomTable } from './extensions/table/extension'
    import { CustomMention } from './extensions/mentions/extension'

    import { TrailingNode } from './extensions/trailingNode'
    import SelectionMenu from './selectionMenu.vue'
    import SelectionMenuTable from './selectionMenuTable.vue'
    import SlashCommands from './extensions/slashCommands/commands'
    import suggestion from './extensions/slashCommands/suggestion'
    import ImageUpload from './extensions/imageUpload/extension'
    import CustomImage from './extensions/image/extension'
    import IFrame from './extensions/iframe/extension'
    import mentionSuggestion from './extensions/mentions/suggestion'

    import LinkPreview from './extensions/linkPreview/linkPreview'
    import { BLOCK_TIPPY_MENU } from '~/constant/readmeMenuItems'
    import { EMBED_EXTENSIONS } from './extensions/embeds'

    export default defineComponent({
        name: 'TiptapEditor',
        components: {
            EditorContent,
            BubbleMenu,
            SelectionMenu,
            SelectionMenuTable,
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
            emptyText: {
                type: String,
                required: false,
                default: ``,
            },
            assetType: {
                type: String,
                required: false,
                default: 'DISCOVERY',
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const showImageBubble = ref(false)
            const widthOption = ref(1)
            const customWidth = ref(100)

            const { isEditMode, emptyText, assetType } = toRefs(props)
            const { modelValue } = useVModels(props, emit)

            const localModelValue = ref(modelValue.value)

            const debouncedEmit = useDebounceFn((content: string) => {
                modelValue.value = content
                emit('change')
            }, 500)

            const editor = useEditor({
                content: localModelValue.value,
                editable: isEditMode.value,
                editorProps: {
                    attributes: {
                        class: 'prose prose-sm w-full h-full break-all',
                        'data-asset-type': assetType.value,
                    },
                },
                autofocus: true,
                extensions: [
                    StarterKit,
                    TrailingNode,
                    Underline,
                    Link,
                    TaskList,
                    TaskItem,
                    TextAlign.configure({
                        types: ['heading', 'paragraph'],
                    }),
                    SlashCommands.configure({
                        suggestion,
                    }),
                    LinkPreview,
                    Highlight.configure({ multicolor: true }),
                    Placeholder.configure({
                        placeholder: ({ node, editor: currEditor }) => {
                            if (!isEditMode.value) {
                                return currEditor.isEmpty ? emptyText.value : ''
                            }
                            switch (node.type.name) {
                                case 'heading':
                                    return 'Type in a heading'
                                case 'codeBlock':
                                    return 'Go ahead. Type some geek...'
                                case 'mention':
                                    return 'Mention a user or a group'
                                default:
                                    return props.placeholder
                            }
                        },
                        showOnlyWhenEditable: false,
                    }),
                    CustomTable.extend({
                        addKeyboardShortcuts() {
                            return {
                                Tab: () => this.editor.commands.goToNextCell(),
                            }
                        },
                    }).configure({
                        resizable: false,
                    }),
                    TableRow,
                    TableHeader.configure({
                        HTMLAttributes: {
                            class: 'border border-l-gray-500 px-3 py-1 text-bold text-sm bg-gray-100',
                        },
                    }),
                    TableCell.configure({
                        HTMLAttributes: {
                            class: 'border border-l-gray-500 px-3 py-1 text-sm',
                        },
                    }),
                    CustomImage,
                    ImageUpload,
                    IFrame,
                    ...EMBED_EXTENSIONS,
                    CustomMention.configure({
                        HTMLAttributes: {
                            class: 'mention',
                        },
                        suggestion: mentionSuggestion,
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

            const shouldShowLegacyMenu = ({ from, to }) => from !== to

            const shouldShowTableMenu = ({ editor: currEditor, from, to }) =>
                // only show the bubble menu for images and links
                currEditor.isActive('table') && from === to

            return {
                editor,
                showImageBubble,
                widthOption,
                customWidth,
                resetEditor,
                applyTemplate,
                getEditorContent,
                shouldShowLegacyMenu,
                shouldShowTableMenu,
                BLOCK_TIPPY_MENU,
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
