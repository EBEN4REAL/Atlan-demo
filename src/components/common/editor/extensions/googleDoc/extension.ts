import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from './component.vue'
import IFrame from '../iframe/extension'

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        googleDoc: {
            /**
             * Add a Google Doc
             */
            insertGoogleDoc: (options: { src: string }) => ReturnType
        }
    }
}

export default IFrame.extend({
    name: 'googleDoc',
    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
    addCommands() {
        return {
            insertGoogleDoc:
                (options: { src: string }) =>
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
})
