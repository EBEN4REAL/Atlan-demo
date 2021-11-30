import { CommandProps, Editor, Extension, Range } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'
import Suggestion, { SuggestionProps } from '@tiptap/suggestion'
import tippy, { Instance, Tippy } from 'tippy.js'
import { blockMenu } from '~/constant/readmeMenuItems'
import CommandsList from './CommandsList.vue'
interface commandsProps {
    editor: Editor
    range: Range
    props: any
}

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
