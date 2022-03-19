import Table from '@tiptap/extension-table'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomTableComponent from './index.vue'

export const CustomTable = Table.extend({
    name: 'customTable',

    addNodeView() {
        return VueNodeViewRenderer(CustomTableComponent)
    },
})
