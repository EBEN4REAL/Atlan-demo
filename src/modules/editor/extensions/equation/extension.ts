import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Equation from './component.vue'
import {
    README_TRIGGERS,
    TYPE_OF_EVENTS,
    useTrackEvent,
} from '~/modules/editor/analytics/useTrackEvent'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        equation: {
            /**
             * Add an equation
             */
            insertEquationBlock: (options) => ReturnType
        }
    }
}

export default Node.create({
    name: 'equation',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return {
            'data-equation': {
                default: '',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div',
                getAttrs: (node) => node.hasAttribute('data-equation') && null,
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', HTMLAttributes]
    },

    addCommands() {
        return {
            insertEquationBlock:
                (options) =>
                ({ tr, dispatch }) => {
                    const { selection } = tr
                    const node = this.type.create(options)

                    if (dispatch) {
                        tr.replaceRangeWith(selection.from, selection.to, node)
                    }

                    return true
                },
        }
    },

    addNodeView() {
        return VueNodeViewRenderer(Equation)
    },
})
