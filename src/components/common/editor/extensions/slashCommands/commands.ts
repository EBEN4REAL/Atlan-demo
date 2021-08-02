import { CommandProps, Editor, Extension, Range } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import Suggestion, { SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance, Tippy } from 'tippy.js'

import CommandsList from './CommandsList.vue'

interface commandsProps {
    editor: Editor;
    range: Range;
    props: any;
}

export interface CommandItem {
    title: string;
    textIcon?: string;
    icon?: string;
    description?: string;
    color?: string;
    command: (props: commandsProps) => void
}

const commands: Record<string, CommandItem[]> = {
    Headings: [
        {
            title: 'H1',
            textIcon: 'H1',
            description: 'Big section heading',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 1 })
                    .run()
            },
        },
        {
            title: 'H2',
            textIcon: 'H2',
            description: 'Medium section heading',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 2 })
                    .run()
            },
        },
        {
            title: 'H3',
            textIcon: 'H3',
            description: 'Small section heading',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setNode('heading', { level: 3 })
                    .run()
            },
        },
    ],
    Transformations: [
        {
            title: 'Bold',
            icon: "fa bold",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark('bold')
                    .run()
            },
        },
        {
            title: 'Italic',
            icon: "fa italic",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark('italic')
                    .run()
            },
        },
        {
            title: 'Underline',
            icon: "fa underline",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark('underline')
                    .run()
            },
        },
        {
            title: 'Strike',
            icon: "fa strikethrough",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setMark('strike')
                    .run()
            },
        },
        {
            title: 'Align Left',
            description: 'Align text to the left',
            icon: "fa align-left",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setTextAlign("left")
                    .run()
            },
        },
        {
            title: 'Align Center',
            description: 'Align text to the center',
            icon: "fa align-center",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setTextAlign("center")
                    .run()
            },
        },
        {
            title: 'Align Right',
            description: 'Align text to the right',
            icon: "fa align-right",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setTextAlign("right")
                    .run()
            },
        },
    ],
    Blocks: [
        {
            title: 'Divider',
            description: 'Add a visual divider',
            textIcon: 'Hr',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .setHorizontalRule()
                    .run()
            },
        },
        {
            title: 'Checklist',
            description: 'Add a to-do-list',
            icon: "fa square",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleTaskList()
                    .run()
            },
        },
        {
            title: 'Quote',
            description: 'Capture a quote',
            icon: "fa quote-left",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleBlockquote()
                    .run()
            },
        },
        {
            title: 'Bulleted List',
            description: 'Create a bulleted list',
            icon: "fa list-ul",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleBulletList()
                    .run()
            },
        },
        {
            title: 'Numbered List',
            description: 'Create a numbered list',
            icon: "fa list-ol",
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleOrderedList()
                    .run()
            },
        },

        {
            title: 'Code Block',
            icon: "fa code",
            description: 'Add a block of code',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleCodeBlock()
                    .run()
            },
        },
    ],
    Highlights: [
        {
            title: 'Default',
            color:'#FFF',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHighlight()
                    .run()
            },
        },
        {
            title: 'Yellow',
            color:'#fde68a',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHighlight({ color: '#fde68a' })
                    .run()
            },
        },
        {
            title: 'Green',
            color:'#a7f3d0',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHighlight({ color: '#a7f3d0' })
                    .run()
            },
        },
        {
            title: 'Blue',
            color:'#bfdbfe',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHighlight({ color: '#bfdbfe' })
                    .run()
            },
        },
        {
            title: 'Pink',
            color:'#fbcfe8',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHighlight({ color: '#fbcfe8' })
                    .run()
            },
        },
        {
            title: 'Red',
            color:'#fca5a5',
            command: ({ editor, range }: commandsProps) => {
                editor
                    .chain()
                    .focus()
                    .deleteRange(range)
                    .toggleHighlight({ color: '#fca5a5' })
                    .run()
            },
        },
    ],
}

export default Extension.create({
    name: 'mention',

    defaultOptions: {
        suggestion: {
            char: '/',
            startOfLine: false,
            command: ({ editor, range, props }: commandsProps) => {
                props.command({ editor, range })
            },
            items: (query: string) => {
                // if (!query){}
                // else{
                const categories = Object.keys(commands)
                const suggestions: Record<string, CommandItem[] | string>[] = [];

                categories.forEach((category) => {
                    const filtered = commands[category].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()))
                    suggestions.push({
                        categoryTitle: category,
                        content: filtered
                    })
                })
                return suggestions
                // }
            },
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