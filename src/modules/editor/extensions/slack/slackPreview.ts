import { Editor, Extension, Range, Node, mergeAttributes } from '@tiptap/core'
import { VueRenderer } from '@tiptap/vue-3'

import { Plugin } from 'prosemirror-state'
import { Slice, Fragment } from 'prosemirror-model'

// node schema - https://tiptap.dev/api/schema#the-node-schema
export default Node.create({
    name: 'slackPreview',
    content: 'block*',
    marks: '_',
    group: 'block',
    inline: false,
    atom: true,
    selectable: true,
    draggable: true,
}
)