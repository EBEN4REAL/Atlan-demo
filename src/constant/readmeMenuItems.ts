export interface CommandItem {
    title: string
    key: string
    helpText: string
    icon?: string
    level?: number
    border?: boolean
    command?: any
}

export const blockMenu: CommandItem[] = [
    {
        title: 'H1',
        key: 'heading-1',
        level: 1,
        helpText: '',
        icon: 'HOne',
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 1 })
                .run(),
    },
    {
        title: 'H2',
        key: 'heading-2',
        level: 2,
        helpText: '',
        icon: 'HTwo',
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 2 })
                .run(),
    },
    {
        title: 'H3',
        key: 'heading-3',
        level: 3,
        icon: 'HThree',
        border: true,
        helpText: '',
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleHeading({ level: 3 })
                .run(),
    },

    {
        title: 'Unordered List',
        key: 'bulletList',
        helpText: '',
        icon: 'BulletList',
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleBulletList().run(),
    },
    {
        title: 'Ordered List',
        key: 'orderedList',
        helpText: '',
        icon: 'NumberedList',
        border: true,
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
    },

    {
        title: 'TaskList',
        key: 'taskList',
        helpText: '',
        icon: 'fa square',
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleTaskList().run(),
    },
    {
        title: 'Blockquote',
        key: 'blockquote',
        helpText: '',
        icon: 'Quotes',
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
    },
    {
        title: 'Code Block',
        key: 'codeBlock',
        helpText: '',
        icon: 'Code',
        border: true,
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .toggleCodeBlock({ language: 'json' })
                .run(),
    },
    {
        title: 'Image Block',
        key: 'uploadimage',
        helpText: '',
        icon: 'ReadmeImage',
        border: true,
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleImageBlock().run(),
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
            editor.chain().focus().deleteRange(range).toggleBold().run()
        },
    },
    {
        title: 'Italic',
        key: 'italic',
        helpText: '',
        icon: 'Italic',
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleItalic().run(),
    },
    {
        title: 'Underline',
        key: 'underline',
        helpText: '',
        icon: 'Underline',
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleUnderline().run(),
    },
    {
        title: 'Strikethrough',
        key: 'strike',
        helpText: '',
        icon: 'Strike',
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).toggleStrike().run(),
    },
    {
        title: 'Align Center',
        key: 'align-center',
        helpText: '',
        icon: 'TextCenter',
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setTextAlign('center')
                .run(),
    },

    {
        title: 'Align Left',
        key: 'align-left',
        helpText: '',
        icon: 'TextLeft',
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setTextAlign('left')
                .run(),
    },
    {
        title: 'Align Right',
        key: 'align-right',
        helpText: '',
        icon: 'TextRight',
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setTextAlign('right')
                .run(),
    },
    {
        title: 'Justify Text',
        key: 'align-justify',
        helpText: '',
        icon: 'JustifyText',
        command: ({ editor, range }) =>
            editor
                .chain()
                .focus()
                .deleteRange(range)
                .setTextAlign('justify')
                .run(),
    },
    {
        title: 'Undo',
        key: 'undo',
        helpText: '',
        icon: 'Undo',
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).undo().run(),
    },
    {
        title: 'Redo',
        key: 'redo',
        helpText: '',
        icon: 'Redo',
        command: ({ editor, range }) =>
            editor.chain().focus().deleteRange(range).redo().run(),
    },
    // table
]
