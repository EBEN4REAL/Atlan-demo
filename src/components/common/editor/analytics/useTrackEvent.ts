import useAddEvent from '~/composables/eventTracking/useAddEvent'

export enum TYPE_OF_EVENTS {
    MARK = 'mark',
    NODE = 'node',
    EMBED = 'embed',
}

export enum NAME_OF_EVENTS {
    HEADING_1 = 'Heading 1',
    HEADING_2 = 'Heading 2',
    HEADING_3 = 'Heading 3',
    BULLETED_LIST = 'Bulleted List',
    NUMBERED_LIST = 'Numbered List',
    IFRAME_INSERTED = 'IFrame',
    EMBED_INSERTED = 'Embed',
    IMAGE_UPLOADED = 'Image Uploaded',
    IMAGE_NODE_INSERTED = 'Image',
    IMAGE_LINKED = 'Image Linked',
    IMAGE_PASTED = 'Image Pasted',
    IMAGE = 'Image',
    MENTION_INSERTED = 'Mention',
    TASK_LIST_INSERTED = 'Task List',
    QUOTE_INSERTED = 'Quote',
    EQUATION_ADDED = 'Equation',
    CODE_BLOCK_INSERTED = 'Code Block',
    TABLE_INSERTED = 'Table',
    BOLD = 'Bold',
    ITALICS = 'Italics',
    UNDERLINE = 'Underline',
    CODE = 'Code',
    STRIKETHROUGH = 'Strikethrough',
    ALIGN_TEXT = 'Align Text',
    ADD_COLUMN = 'Add Column',
    ADD_ROW = 'Add Row',
    DELETE_COLUMN = 'Delete Column',
    DELETE_ROW = 'Delete Row',
    DELETE_TABLE = 'Delete Table',
    OPEN_CTA_CLICKED = 'Open CTA Clicked',
}

export enum README_TRIGGERS {
    SLASH_MENU = 'Slash Menu',
    TIPPY_MENU = 'Tippy Menu',
    MARKDOWN_SHORTCUT = 'Markdown Shortcut',
    LINKED = 'Linked',
    PASTED = 'Pasted',
    UPLOADED = 'Uploaded',
}

export function useTrackEvent(options: {
    type: TYPE_OF_EVENTS
    name: NAME_OF_EVENTS
    trigger: README_TRIGGERS
    properties?: {
        assetType?: string
        alignment?: 'center' | 'left' | 'right' | 'justify'
        embedService?: string
    }
}) {
    console.log({ options })
    if (options.type === TYPE_OF_EVENTS.EMBED) {
        if (options.name === NAME_OF_EVENTS.OPEN_CTA_CLICKED) {
            useAddEvent('readme', 'embed', 'open_cta_clicked', {
                application: options.properties?.embedService,
                trigger: options.trigger,
                assetType:
                    options &&
                    options.properties &&
                    options.properties.assetType
                        ? options.properties.assetType
                        : 'DISCOVERY',
            })
        } else {
            useAddEvent('readme', 'embed', 'added', {
                application: options.properties?.embedService,
                trigger: options.trigger,
                assetType:
                    options &&
                    options.properties &&
                    options.properties.assetType
                        ? options.properties.assetType
                        : 'DISCOVERY',
            })
        }
    } else if (options.type === TYPE_OF_EVENTS.NODE) {
        useAddEvent('readme', 'block', 'added', {
            blockType: options.name,
            trigger: options.trigger,
            assetType:
                options && options.properties && options.properties.assetType
                    ? options.properties.assetType
                    : 'DISCOVERY',
        })
    } else {
        useAddEvent('readme', 'formatting', 'added', {
            markType: options.name,
            trigger: options.trigger,
            assetType:
                options && options.properties && options.properties.assetType
                    ? options.properties.assetType
                    : 'DISCOVERY',
            ...(options.properties?.alignment && {
                alignment: options.properties?.alignment,
            }),
        })
    }
}
