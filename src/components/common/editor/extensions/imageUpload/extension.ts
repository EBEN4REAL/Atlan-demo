import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { TextSelection } from 'prosemirror-state'
import Component from './component.vue'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imageBlock: {
            /**
             * Set a code block
             */
            setImageBlock: () => ReturnType
            /**
             * Toggle a code block
             */
            toggleImageBlock: () => ReturnType

            unsetImageBlock: () => ReturnType
        }
    }
}

export default Node.create({
    name: 'uploadimage',

    group: 'block',

    atom: true,

    draggable: true,

    addAttributes() {
        return {}
    },

    parseHTML() {
        return [
            {
                tag: 'uploadimage',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['uploadimage', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
    addCommands() {
        return {
            setImageBlock:
                () =>
                ({ commands }) =>
                    commands.wrapIn('uploadimage'),
            toggleImageBlock:
                (options: any) =>
                ({ chain }) =>
                    chain()
                        // remove node before hr if it’s an empty text block
                        .command(({ tr, dispatch }) => {
                            const { selection } = tr
                            const { empty, $anchor } = selection
                            const isEmptyTextBlock =
                                $anchor.parent.isTextblock &&
                                !$anchor.parent.type.spec.code &&
                                !$anchor.parent.textContent

                            if (!empty || !isEmptyTextBlock || !dispatch) {
                                return true
                            }

                            const from = $anchor.before()
                            const to = $anchor.start()

                            tr.deleteRange(from, to)
                            tr.setSelection(TextSelection.create(tr.doc, from))

                            return true
                        })
                        .insertContent({ type: this.name })
                        // add node after hr if it’s the end of the document
                        .command(({ tr, dispatch }) => {
                            if (dispatch) {
                                const { parent, pos } = tr.selection.$from
                                const posAfter = pos + 1
                                const nodeAfter = tr.doc.nodeAt(posAfter)

                                if (!nodeAfter) {
                                    const node =
                                        parent.type.contentMatch.defaultType?.create()

                                    if (node) {
                                        tr.insert(posAfter, node)
                                        tr.setSelection(
                                            TextSelection.create(
                                                tr.doc,
                                                posAfter
                                            )
                                        )
                                    }
                                }

                                tr.scrollIntoView()
                            }

                            return true
                        })
                        .run(),

            unsetImageBlock:
                () =>
                ({ commands }) =>
                    commands.lift('uploadimage'),
        }
    },
})
