import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { Image } from '@tiptap/extension-image'
import { TextSelection } from 'prosemirror-state'
import Component from './component.vue'

export default Image.extend({
    name: 'uploadimage',

    atom: true,

    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
    addCommands() {
        return {
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
                        .insertContent({ type: this.name, attrs: options })
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
        }
    },
})
