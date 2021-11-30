import { CommandProps, Editor, Extension, Range } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import Suggestion, { SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance, Tippy } from 'tippy.js'

import CommandsList from './CommandsList.vue'

interface commandsProps {
    editor: Editor
    range: Range
    props: any
}

export interface CommandItem {
    title: string
    key: string
    helpText: string
    icon?: string
    level?: number
    border?: boolean
    onClick: (editor: Editor) => void
}

const blockMenu: CommandItem[] = [
    {
        title: 'H1',
        key: 'heading-1',
        level: 1,
        helpText: '',
        icon: 'HOne',
        onClick: (editor) =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        title: 'H2',
        key: 'heading-2',
        level: 2,
        helpText: '',
        icon: 'HTwo',
        onClick: (editor) =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        title: 'H3',
        key: 'heading-3',
        level: 3,
        icon: 'HThree',
        border: true,
        helpText: '',
        onClick: (editor) =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },

    {
        title: 'Unordered List',
        key: 'bulletList',
        helpText: '',
        icon: 'BulletList',
        onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
        title: 'Ordered List',
        key: 'orderedList',
        helpText: '',
        icon: 'NumberedList',
        border: true,
        onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },

    {
        title: 'TaskList',
        key: 'taskList',
        helpText: '',
        icon: 'fa square',
        onClick: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
    {
        title: 'Blockquote',
        key: 'blockquote',
        helpText: '',
        icon: 'Quotes',
        onClick: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
        title: 'Code Block',
        key: 'codeBlock',
        helpText: '',
        icon: 'Code',
        border: true,
        onClick: (editor) =>
            editor.chain().focus().toggleCodeBlock({ language: 'json' }).run(),
    },
    {
        title: 'Image Block',
        key: 'uploadimage',
        helpText: '',
        icon: 'ReadmeImage',
        border: true,
        onClick: (editor) => editor.chain().focus().toggleImageBlock().run(),
    },
]

export default Extension.create({
    name: 'mention',

    defaultOptions: {
        suggestion: {
            char: '/',
            command: ({ editor, range, props }: commandsProps) => {
                props.command({ editor, range })
            },
            items: () => blockMenu,
            render: () => {
                let component: VueRenderer
                let popup: Instance[]
                return {
                    onStart: (props: SuggestionProps) => {
                        component = new VueRenderer(CommandsList, {
                            editor: props.editor,
                            props,
                        })

                        popup = tippy('body', {
                            getReferenceClientRect: props.clientRect,
                            appendTo: () => document.body,
                            content: component.element,
                            showOnCreate: true,
                            interactive: true,
                            trigger: 'manual',
                            placement: 'bottom-start',
                        })
                    },
                    onUpdate(props: SuggestionProps) {
                        component.updateProps(props)

                        popup[0].setProps({
                            getReferenceClientRect: props.clientRect,
                        })
                    },
                    onKeyDown(props: SuggestionProps) {
                        return component.ref?.onKeyDown(props)
                    },
                    onExit() {
                        popup[0].destroy()
                        component.destroy()
                    },
                }
            },
        },
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})
