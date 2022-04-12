import { Editor } from '@tiptap/vue-3'
import iconMap from '@common/icon/iconMap'
import {
    NAME_OF_EVENTS,
    README_TRIGGERS,
    TYPE_OF_EVENTS,
    useTrackEvent,
} from '~/modules/editor/analytics/useTrackEvent'

export interface CommandItem {
    title: string
    key: string
    helpText: string
    searchKeys: string[]
    icon?: keyof typeof iconMap
    level?: number
    border?: boolean
    disabled?: any
    command?: any
}

export interface MenuItem {
    title: string
    key: string
    helpText: string
    icon?: keyof typeof iconMap
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
        helpText: 'The biggest, boldest heading',
        icon: 'HOne',
        searchKeys: ['h1', 'heading', 'heading1', 'heading 1'],
        disabled: () => false,
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleHeading({ level: 1 })
                      .run()
                : editor.chain().focus().toggleHeading({ level: 1 }).run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.HEADING_1,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Heading 2',
        key: 'heading-2',
        level: 2,
        helpText: 'The bigger, bolder heading',
        icon: 'HTwo',
        searchKeys: ['h2', 'heading', 'heading2', 'heading 2'],
        disabled: () => false,
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleHeading({ level: 2 })
                      .run()
                : editor.chain().focus().toggleHeading({ level: 2 }).run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.HEADING_2,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Heading 3',
        key: 'heading-3',
        level: 3,
        icon: 'HThree',
        searchKeys: ['h3', 'heading', 'heading3', 'heading 3'],
        border: true,
        helpText: 'The big, bold heading',
        disabled: () => false,
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleHeading({ level: 3 })
                      .run()
                : editor.chain().focus().toggleHeading({ level: 3 }).run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.HEADING_3,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },

    {
        title: 'Bulleted List',
        key: 'bulletList',
        helpText: 'A simple, bulleted list',
        icon: 'BulletList',
        searchKeys: ['ul', 'bullet', 'list', 'bulleted list'],
        disabled: (editor: Editor) =>
            !editor.can().toggleList('bulletList', 'listItem'),
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleBulletList()
                      .run()
                : editor.chain().focus().toggleBulletList().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.BULLETED_LIST,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Numbered List',
        key: 'orderedList',
        helpText: 'A serialised list with numbers',
        icon: 'NumberedList',
        border: true,
        searchKeys: ['ol', 'number', 'list', 'numbered list'],
        disabled: (editor: Editor) =>
            !editor.can().toggleList('orderedList', 'listItem'),
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleOrderedList()
                      .run()
                : editor.chain().focus().toggleOrderedList().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.NUMBERED_LIST,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },

    {
        title: 'Checklist',
        key: 'taskList',
        helpText: 'A to-do list with checkboxes',
        icon: 'TaskList',
        searchKeys: ['checklist', 'check', 'list', 'task list', 'tasklist'],
        disabled: (editor: Editor) => !editor.can().toggleTaskList(),
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleTaskList()
                      .run()
                : editor.chain().focus().toggleTaskList().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.TASK_LIST_INSERTED,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Quote',
        key: 'blockquote',
        helpText: 'A quote to emphasise a segment',
        icon: 'Quotes',
        searchKeys: ['quote', 'blockquote'],
        disabled: () => false,
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleBlockquote()
                      .run()
                : editor.chain().focus().toggleBlockquote().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.QUOTE_INSERTED,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Code',
        key: 'codeBlock',
        helpText: 'Highlight a chunk of code',
        icon: 'Code',
        border: true,
        searchKeys: ['code', 'codeblock'],
        disabled: () => false,
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleCodeBlock({ language: 'json' })
                      .run()
                : editor
                      .chain()
                      .focus()
                      .toggleCodeBlock({ language: 'json' })
                      .run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.CODE_BLOCK_INSERTED,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Image',
        key: 'uploadimage',
        helpText: 'Upload an image',
        icon: 'ReadmeImage',
        border: true,
        searchKeys: ['image', 'images'],
        disabled: () => false,
        command: ({ editor, range }) => {
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .toggleImageBlock()
                      .run()
                : editor.chain().focus().toggleImageBlock().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.IMAGE_NODE_INSERTED,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Mention',
        key: 'mention',
        helpText: 'Mention a user or group',
        icon: 'Mention',
        border: true,
        searchKeys: ['mention', 'user', 'group'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertMention()
                      .run()
                : editor.chain().focus().insertMention().run(),
    },
    {
        title: 'Table',
        key: 'insertTable',
        helpText: 'Insert a table',
        icon: 'TableBlack',
        border: true,
        searchKeys: ['table'],
        disabled: () => false,
        command: ({ editor, range }) => {
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
                : editor.chain().focus().insertTable().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.NODE,
                name: NAME_OF_EVENTS.TABLE_INSERTED,
                trigger: README_TRIGGERS.SLASH_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Google Doc',
        key: 'googleDoc',
        helpText: 'Embed a Google Doc',
        icon: 'GoogleDoc',
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
        helpText: 'Embed a Google Sheet',
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
        helpText: 'Embed a Google Presentation',
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
    {
        title: 'Miro Board',
        key: 'miro',
        helpText: 'Embed a Miro board',
        icon: 'Miro',
        border: true,
        searchKeys: ['miro', 'board', 'drawing'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertMiroBoard()
                      .run()
                : editor.chain().focus().insertMiroBoard().run(),
    },
    {
        title: 'FigJam',
        key: 'figjam',
        helpText: 'Embed a FigJam',
        icon: 'Figma',
        border: true,
        searchKeys: ['figma', 'fig', 'jam'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor.chain().focus().deleteRange(range).insertFigjam().run()
                : editor.chain().focus().insertFigjam().run(),
    },
    {
        title: 'Lucidchart',
        key: 'lucid',
        helpText: 'Embed a Lucidchart Diagram',
        icon: 'Lucid',
        border: true,
        searchKeys: ['lucid', 'chart'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertLucidChart()
                      .run()
                : editor.chain().focus().insertLucidChart().run(),
    },
    {
        title: 'DBDiagram',
        key: 'dbdiagram',
        helpText: 'Embed a DB Diagram',
        icon: 'DBDiagram',
        border: true,
        searchKeys: ['dbdiagram', 'db'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertDbDiagram()
                      .run()
                : editor.chain().focus().insertDbDiagram().run(),
    },
    {
        title: 'Microsoft Word',
        key: 'microsoftWord',
        helpText: 'Embed a Microsoft Word Document.',
        icon: 'MicrosoftWord',
        border: true,
        searchKeys: ['microsoft', 'word'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertMicrosoftWord()
                      .run()
                : editor.chain().focus().insertMicrosoftWord().run(),
    },
    {
        title: 'Microsoft Excel',
        key: 'microsoftExcel',
        helpText: 'Embed a Microsoft Excel sheet',
        icon: 'MicrosoftExcel',
        border: true,
        searchKeys: ['microsoft', 'excel'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertMicrosoftExcel()
                      .run()
                : editor.chain().focus().insertMicrosoftExcel().run(),
    },
    {
        title: 'Microsoft PowerPoint',
        key: 'microsoftPowerpoint',
        helpText: 'Embed a Microsoft PowerPoint presentation.',
        icon: 'MicrosoftPowerpoint',
        border: true,
        searchKeys: ['microsoft', 'powerpoint'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertMicrosoftPowerpoint()
                      .run()
                : editor.chain().focus().insertMicrosoftPowerpoint().run(),
    },
    {
        title: 'Google Data Studio',
        key: 'googleDataStudio',
        helpText: 'Embed a Google Data Studio Report',
        icon: 'GoogleDataStudio',
        border: true,
        searchKeys: ['google', 'data studio', 'data', 'studio'],
        disabled: () => false,
        command: ({ editor, range }) =>
            range
                ? editor
                      .chain()
                      .focus()
                      .deleteRange(range)
                      .insertGoogleDataStudioReport()
                      .run()
                : editor.chain().focus().insertGoogleDataStudioReport().run(),
    },
]

export const menuData: MenuItem[] = [
    {
        title: 'Bold',
        key: 'bold',
        helpText: '',
        icon: 'Bold',
        command: ({ editor }) => {
            editor.chain().focus().toggleBold().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.BOLD,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Italic',
        key: 'italic',
        helpText: '',
        icon: 'Italic',
        command: ({ editor }) => {
            editor.chain().focus().toggleItalic().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.ITALICS,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Underline',
        key: 'underline',
        helpText: '',
        icon: 'Underline',
        command: ({ editor }) => {
            editor.chain().focus().toggleUnderline().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.UNDERLINE,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Code',
        key: 'code',
        helpText: '',
        icon: 'Code',
        command: ({ editor }) => {
            editor.chain().focus().toggleCode().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.CODE,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Strikethrough',
        key: 'strike',
        helpText: '',
        icon: 'Strike',
        command: ({ editor }) => {
            editor.chain().focus().toggleStrike().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.STRIKETHROUGH,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Align Center',
        key: 'align-center',
        helpText: '',
        icon: 'TextCenter',
        command: ({ editor }) => {
            editor.chain().focus().setTextAlign('center').run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.ALIGN_TEXT,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    alignment: 'center',
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },

    {
        title: 'Align Left',
        key: 'align-left',
        helpText: '',
        icon: 'TextLeft',
        command: ({ editor }) => {
            editor.chain().focus().setTextAlign('left').run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.ALIGN_TEXT,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    alignment: 'left',
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Align Right',
        key: 'align-right',
        helpText: '',
        icon: 'TextRight',
        command: ({ editor }) => {
            editor.chain().focus().setTextAlign('right').run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.ALIGN_TEXT,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    alignment: 'right',
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Justify Text',
        key: 'align-justify',
        helpText: '',
        icon: 'JustifyText',
        command: ({ editor }) => {
            editor.chain().focus().setTextAlign('justify').run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.ALIGN_TEXT,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    alignment: 'justify',
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
]

export const menuDataTable: MenuItem[] = [
    {
        title: 'Add Column',
        key: 'insert-column-after',
        helpText: 'Append a column to the table',
        icon: 'AddColumn',
        command: ({ editor }) => {
            editor.chain().focus().addColumnAfter().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.ADD_COLUMN,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Add Row',
        key: 'insert-row-after',
        helpText: 'Append a row to the table',
        icon: 'AddColumn',
        command: ({ editor }) => {
            editor.chain().focus().addRowAfter().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.ADD_ROW,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Delete Column',
        key: 'delete-column',
        helpText: 'Delete the current column',
        icon: 'AddColumn',
        command: ({ editor }) => {
            editor.chain().focus().deleteColumn().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.DELETE_COLUMN,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Delete Row',
        key: 'delete-row',
        helpText: 'Delete the current row',
        icon: 'AddColumn',
        command: ({ editor }) => {
            editor.chain().focus().deleteRow().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.DELETE_ROW,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
    },
    {
        title: 'Delete Table',
        key: 'delete-table',
        helpText: 'Delete the table',
        icon: 'AddColumn',
        command: ({ editor }) => {
            editor.chain().focus().deleteTable().run()
            useTrackEvent({
                type: TYPE_OF_EVENTS.MARK,
                name: NAME_OF_EVENTS.DELETE_TABLE,
                trigger: README_TRIGGERS.TIPPY_MENU,
                properties: {
                    assetType:
                        editor.options?.editorProps?.attributes?.[
                            'data-asset-type'
                        ],
                },
            })
        },
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
