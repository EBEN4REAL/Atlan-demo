import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from './index.vue'

export default Node.create({
  name: 'sql',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      count: {
        default: 0,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'sql',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['sql', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})