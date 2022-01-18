import { Editor } from '@tiptap/vue-3'

export interface CommandItem {
    title: string
    key: string
    helpText: string
    icon?: string
    level?: number
    border?: boolean
    disabled?: any
    command?: any
}

export const blockMenu: CommandItem[] = [
    {
        title: 'H1',
        key: 'heading-1',
        level: 1,
        helpText: '',
        icon: 'HOne',
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleHeading({ level: 1 })
                      .run()
                : editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        title: 'H2',
        key: 'heading-2',
        level: 2,
        helpText: '',
        icon: 'HTwo',
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleHeading({ level: 2 })
                      .run()
                : editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        title: 'H3',
        key: 'heading-3',
        level: 3,
        icon: 'HThree',
        border: true,
        helpText: '',
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleHeading({ level: 3 })
                      .run()
                : editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },

    {
        title: 'Unordered List',
        key: 'bulletList',
        helpText: '',
        icon: 'BulletList',
        disabled: (editor: Editor) =>
            !editor.can().toggleList('bulletList', 'listItem'),
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleBulletList()
                      .run()
                : editor.chain().focus().toggleBulletList().run(),
    },
    {
        title: 'Ordered List',
        key: 'orderedList',
        helpText: '',
        icon: 'NumberedList',
        border: true,
        disabled: (editor: Editor) =>
            !editor.can().toggleList('orderedList', 'listItem'),
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleOrderedList()
                      .run()
                : editor.chain().focus().toggleOrderedList().run(),
    },

    {
        title: 'TaskList',
        key: 'taskList',
        helpText: '',
        icon: 'TaskList',
        disabled: (editor: Editor) => !editor.can().toggleTaskList(),
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleTaskList()
                      .run()
                : editor.chain().focus().toggleTaskList().run(),
    },
    {
        title: 'Blockquote',
        key: 'blockquote',
        helpText: '',
        icon: 'Quotes',
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleBlockquote()
                      .run()
                : editor.chain().focus().toggleBlockquote().run(),
    },
    {
        title: 'Code Block',
        key: 'codeBlock',
        helpText: '',
        icon: 'Code',
        border: true,
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleCodeBlock({ language: 'json' })
                      .run()
                : editor.chain().focus().toggleImageBlock().run(),
    },
    {
        title: 'Image Block',
        key: 'uploadimage',
        helpText: '',
        icon: 'ReadmeImage',
        border: true,
        disabled: (editor: Editor) => !editor.can().toggleImageBlock(),
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleImageBlock()
                      .run()
                : editor.chain().focus().toggleImageBlock().run(),
    },
    {
        title: 'Table',
        key: 'insertTable',
        helpText: 'Insert a table',
        icon: 'Table',
        border: true,
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertTable({
                          rows: 3,
                          cols: 3,
                          withHeaderRow: true,
                      })
                      .run()
                : editor.chain().focus().insertTable().run(),
    },
    /*   {
        title: 'Google doc',
        key: 'googleDoc',
        helpText: '',
        icon: 'Gdoc',
        border: true,
        command: ({ editor, range }) => editor.chain().focus().toggleImageBlock().run(),
    }, */
]

export const menuData: CommandItem[] = [
    {
        title: 'Bold',
        key: 'bold',
        helpText: '',
        icon: 'Bold',
        command: ({ editor, range }) => {
            editor.chain().focus().toggleBold().run()
        },
    },
    {
        title: 'Italic',
        key: 'italic',
        helpText: '',
        icon: 'Italic',
        command: ({ editor, range }) =>
            editor.chain().focus().toggleItalic().run(),
    },
    {
        title: 'Underline',
        key: 'underline',
        helpText: '',
        icon: 'Underline',
        command: ({ editor, range }) =>
            editor.chain().focus().toggleUnderline().run(),
    },
    {
        title: 'Strikethrough',
        key: 'strike',
        helpText: '',
        icon: 'Strike',
        command: ({ editor, range }) =>
            editor.chain().focus().toggleStrike().run(),
    },
    {
        title: 'Align Center',
        key: 'align-center',
        helpText: '',
        icon: 'TextCenter',
        command: ({ editor, range }) =>
            editor.chain().focus().setTextAlign('center').run(),
    },

    {
        title: 'Align Left',
        key: 'align-left',
        helpText: '',
        icon: 'TextLeft',
        command: ({ editor, range }) =>
            editor.chain().focus().setTextAlign('left').run(),
    },
    {
        title: 'Align Right',
        key: 'align-right',
        helpText: '',
        icon: 'TextRight',
        command: ({ editor, range }) =>
            editor.chain().focus().setTextAlign('right').run(),
    },
    {
        title: 'Justify Text',
        key: 'align-justify',
        helpText: '',
        icon: 'JustifyText',
        command: ({ editor, range }) =>
            editor.chain().focus().setTextAlign('justify').run(),
    },
    {
        title: 'Undo',
        key: 'undo',
        helpText: '',
        icon: 'Undo',
        command: ({ editor, range }) => editor.chain().focus().undo().run(),
    },
    {
        title: 'Redo',
        key: 'redo',
        helpText: '',
        icon: 'Redo',
        command: ({ editor, range }) => editor.chain().focus().redo().run(),
    },
    // table
]

export const menuDataTable: CommandItem[] = [
    {
        title: 'Insert Row After',
        key: 'insert-row-after',
        helpText: 'Insert a row below this cell',
        icon: 'Add',
        command: ({ editor }) => editor.chain().focus().addRowAfter().run(),
    },
    // table
]
