import { Editor } from '@tiptap/vue-3'

export interface CommandItem {
    title: string
    key: string
    helpText: string
    searchKeys: string[]
    icon?: string
    level?: number
    border?: boolean
    disabled?: any
    command?: any
}

export interface MenuItem {
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
        title: 'Heading 1',
        key: 'heading-1',
        level: 1,
        helpText: '',
        icon: 'HOne',
        searchKeys: ['h1', 'heading', 'heading1', 'heading 1'],
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
        title: 'Heading 2',
        key: 'heading-2',
        level: 2,
        helpText: '',
        icon: 'HTwo',
        searchKeys: ['h2', 'heading', 'heading2', 'heading 2'],
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
        title: 'Heading 3',
        key: 'heading-3',
        level: 3,
        icon: 'HThree',
        searchKeys: ['h3', 'heading', 'heading3', 'heading 3'],
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
        title: 'Bulleted List',
        key: 'bulletList',
        helpText: '',
        icon: 'BulletList',
        searchKeys: ['ul', 'bullet', 'list', 'bulleted list'],
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
        title: 'Numbered List',
        key: 'orderedList',
        helpText: '',
        icon: 'NumberedList',
        border: true,
        searchKeys: ['ol', 'number', 'list', 'numbered list'],
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
        title: 'Checklist',
        key: 'taskList',
        helpText: '',
        icon: 'TaskList',
        searchKeys: ['checklist', 'check', 'list', 'task list', 'tasklist'],
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
        title: 'Quote',
        key: 'blockquote',
        helpText: '',
        icon: 'Quotes',
        searchKeys: ['quote', 'blockquote'],
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
        title: 'Code',
        key: 'codeBlock',
        helpText: '',
        icon: 'Code',
        border: true,
        searchKeys: ['code', 'codeblock'],
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
        title: 'Image',
        key: 'uploadimage',
        helpText: '',
        icon: 'ReadmeImage',
        border: true,
        searchKeys: ['image', 'images'],
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
        icon: 'TableBlack',
        border: true,
        searchKeys: ['table'],
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
    {
        title: 'Google Doc',
        key: 'googleDoc',
        helpText: '',
        icon: 'Gdoc',
        border: true,
        searchKeys: ['google', 'doc', 'embed', 'google doc'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertGoogleDoc()
                      .run()
                : editor.chain().focus().insertGoogleDoc().run(),
    },
    {
        title: 'Google Sheet',
        key: 'googleSheet',
        helpText: '',
        icon: 'GoogleSheet',
        border: true,
        searchKeys: ['google', 'sheet', 'excel'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertGoogleSheet()
                      .run()
                : editor.chain().focus().insertGoogleSheet().run(),
    },
    {
        title: 'Google Slides',
        key: 'googleSlide',
        helpText: '',
        icon: 'GoogleSlide',
        border: true,
        searchKeys: ['google', 'slide', 'presentation'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertGoogleSlide()
                      .run()
                : editor.chain().focus().insertGoogleSlide().run(),
    },
    // {
    //     title: 'Google Drive',
    //     key: 'googleDrive',
    //     helpText: '',
    //     icon: 'GoogleDrive',
    //     border: true,
    //     searchKeys: ['google', 'drive'],
    //     disabled: () => false,
    //     command: ({ editor, range }) =>
    //         range
    //             ? editor
    //                   .chain()
    //                   .focus()
    //                   .deleteRange(range)
    //                   .insertGoogleDrive()
    //                   .run()
    //             : editor.chain().focus().insertGoogleDrive().run(),
    // },
]

export const menuData: MenuItem[] = [
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

export const menuDataTable: MenuItem[] = [
    {
        title: 'Add Column',
        key: 'insert-column-after',
        helpText: 'Append a column to the table',
        icon: 'AddColumn',
        command: ({ editor }) => editor.chain().focus().addColumnAfter().run(),
    },
    {
        title: 'Add Row',
        key: 'insert-row-after',
        helpText: 'Append a row to the table',
        icon: 'AddColumn',
        command: ({ editor }) => editor.chain().focus().addRowAfter().run(),
    },
    {
        title: 'Delete Column',
        key: 'delete-column',
        helpText: 'Delete the current column',
        icon: 'AddColumn',
        command: ({ editor }) => editor.chain().focus().deleteColumn().run(),
    },
    {
        title: 'Delete Row',
        key: 'delete-row',
        helpText: 'Delete the current row',
        icon: 'AddColumn',
        command: ({ editor }) => editor.chain().focus().deleteRow().run(),
    },
    {
        title: 'Delete Table',
        key: 'delete-table',
        helpText: 'Delete the table',
        icon: 'AddColumn',
        command: ({ editor }) => editor.chain().focus().deleteTable().run(),
    },
    // table
]

export const BLOCK_TIPPY_MENU = [
    'uploadimage',
    'image',
    'googleDoc',
    'iframe',
    'table',
]
