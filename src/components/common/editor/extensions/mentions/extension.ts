import Mention from '@tiptap/extension-mention'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MentionNode from './mention.vue'

export const CustomMention = Mention.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            'is-user': {
                default: true,
                parseHTML: (element) =>
                    element.getAttribute('data-is-user') === 'true',
                renderHTML: (attributes) => {
                    if (!attributes['is-user']) {
                        return {}
                    }

                    return {
                        'data-is-user': attributes['is-user'],
                    }
                },
            },
        }
    },
    addNodeView() {
        return VueNodeViewRenderer(MentionNode)
    },
})
