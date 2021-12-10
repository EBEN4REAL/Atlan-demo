import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import { TextSelection } from 'prosemirror-state'
import Component from './component.vue'

export interface ImageOptions {
    inline: boolean
    HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        imageBlock: {
            /**
             * Set a code block
             */

            /**
             * Toggle a code block
             */
            toggleImageBlock: () => ReturnType
        }
    }
}

export default Node.create<ImageOptions>({
    name: 'googleDoc',

    group: 'block',

    atom: true,

    draggable: true,

    addOptions() {
        return {
            inline: false,
            HTMLAttributes: {},
        }
    },
    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
        }
    },

    // addAttributes() {
    //     return {
    //         src: {
    //             default:
    //                 'https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_2x1.jpg',
    //         },
    //     }
    // },
    // parseHTML() {
    //     return [
    //         {
    //             tag: 'uploadimage',
    //         },
    //     ]
    // },

    parseHTML() {
        return [
            {
                tag: 'img[src]',
            },
        ]
    },
    renderHTML({ HTMLAttributes }) {
        return [
            'img',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        ]
    },

    // renderHTML({ HTMLAttributes }) {
    //     return ['uploadimage', mergeAttributes(HTMLAttributes)]
    // },

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
