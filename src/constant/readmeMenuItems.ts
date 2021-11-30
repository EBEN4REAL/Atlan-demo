export interface CommandItem {
    title: string
    key: string
    helpText: string
    icon?: string
    level?: number
    border?: boolean
    onClick: (editor: Editor) => void
}

export const blockMenu: CommandItem[] = [
    {
        title: 'H1',
        key: 'heading-1',
        level: 1,
        helpText: '',
        icon: 'HOne',
        onClick: (editor) =>
            editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
        title: 'H2',
        key: 'heading-2',
        level: 2,
        helpText: '',
        icon: 'HTwo',
        onClick: (editor) =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        title: 'H3',
        key: 'heading-3',
        level: 3,
        icon: 'HThree',
        border: true,
        helpText: '',
        onClick: (editor) =>
            editor.chain().focus().toggleHeading({ level: 3 }).run(),
    },

    {
        title: 'Unordered List',
        key: 'bulletList',
        helpText: '',
        icon: 'BulletList',
        onClick: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
        title: 'Ordered List',
        key: 'orderedList',
        helpText: '',
        icon: 'NumberedList',
        border: true,
        onClick: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },

    {
        title: 'TaskList',
        key: 'taskList',
        helpText: '',
        icon: 'fa square',
        onClick: (editor) => editor.chain().focus().toggleTaskList().run(),
    },
    {
        title: 'Blockquote',
        key: 'blockquote',
        helpText: '',
        icon: 'Quotes',
        onClick: (editor) => editor.chain().focus().toggleBlockquote().run(),
    },
    {
        title: 'Code Block',
        key: 'codeBlock',
        helpText: '',
        icon: 'Code',
        border: true,
        onClick: (editor) =>
            editor.chain().focus().toggleCodeBlock({ language: 'json' }).run(),
    },
    {
        title: 'Image Block',
        key: 'uploadimage',
        helpText: '',
        icon: 'ReadmeImage',
        border: true,
        onClick: (editor) => editor.chain().focus().toggleImageBlock().run(),
    },
]

export const menuData: CommandItem[] = [
    {
        title: 'Bold',
        key: 'bold',
        helpText: '',
        icon: 'Bold',
        onClick: (editor) => {
            editor.chain().focus().toggleBold().run()
        },
    },
    {
        title: 'Italic',
        key: 'italic',
        helpText: '',
        icon: 'Italic',
        onClick: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
        title: 'Underline',
        key: 'underline',
        helpText: '',
        icon: 'Underline',
        onClick: (editor) => editor.chain().focus().toggleUnderline().run(),
    },
    {
        title: 'Strikethrough',
        key: 'strike',
        helpText: '',
        icon: 'Strike',
        onClick: (editor) => editor.chain().focus().toggleStrike().run(),
    },
    {
        title: 'Align Center',
        key: 'alignCenter',
        helpText: '',
        icon: 'TextCenter',
        onClick: (editor) =>
            editor.chain().focus().setTextAlign('center').run(),
    },

    {
        title: 'Align Left',
        key: 'alignLeft',
        helpText: '',
        icon: 'TextLeft',
        onClick: (editor) => editor.chain().focus().setTextAlign('left').run(),
    },
    {
        title: 'Align Right',
        key: 'alignRight',
        helpText: '',
        icon: 'TextRight',
        onClick: (editor) => editor.chain().focus().setTextAlign('right').run(),
    },
    {
        title: 'Justify Text',
        key: 'justify',
        helpText: '',
        icon: 'JustifyText',
        onClick: (editor) =>
            editor.chain().focus().setTextAlign('justify').run(),
    },
    {
        title: 'Undo',
        key: 'undo',
        helpText: '',
        icon: 'Undo',
        onClick: (editor) => editor.chain().focus().undo().run(),
    },
    {
        title: 'Redo',
        key: 'redo',
        helpText: '',
        icon: 'Redo',
        onClick: (editor) => editor.chain().focus().redo().run(),
    },
    // table
]
