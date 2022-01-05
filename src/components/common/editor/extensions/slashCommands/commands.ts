import { Editor, Extension, Range } from '@tiptap/core'
import Suggestion from '@tiptap/suggestion'

interface commandsProps {
    editor: Editor
    range: Range
    props: any
}

export default Extension.create({
    name: 'commands',

    addOptions() {
        return {
            suggestion: {
                char: '/',
                command: ({ editor, range, props }: commandsProps) => {
                    props.command({ editor, range })
                },
            },
        }
    },
    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})
