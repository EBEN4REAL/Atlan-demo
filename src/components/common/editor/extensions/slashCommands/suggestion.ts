import { blockMenu } from '~/constant/readmeMenuItems'
import { VueRenderer } from '@tiptap/vue-3'
import tippy, { Instance } from 'tippy.js'
import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import CommandsList from '@common/editor/extensions/slashCommands/CommandsList.vue'

export default {
    items: (query: string) =>
        query.length
            ? blockMenu.filter((item) =>
                  item.title.toLowerCase().startsWith(query.toLowerCase())
              )
            : blockMenu,
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
            onKeyDown(props: SuggestionKeyDownProps) {
                /* if (props.event.key === 'Escape') {
            popup[0].hide()

            return true
        } */
                return component.ref?.onKeyDown(props)
            },
            onExit() {
                popup[0].destroy()
                component.destroy()
            },
        }
    },
}
