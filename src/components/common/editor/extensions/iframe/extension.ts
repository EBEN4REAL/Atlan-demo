import { Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CustomIFrame from './component.vue'

export interface IframeOptions {
    allowFullscreen: boolean
    sandbox: string
    HTMLAttributes: {
        [key: string]: any
    }
    showFooter: boolean
    width?: string
    height?: string
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        iframe: {
            /**
             * Add an iframe
             */
            setIframe: (options: {
                src: string
                embedtitle: string
                embedicon: string
                width?: string
                height?: string
                redirectTo?: string
            }) => ReturnType
        }
    }
}

export default Node.create<IframeOptions>({
    name: 'iframe',

    group: 'block',

    atom: true,

    draggable: true,

    addOptions() {
        return {
            allowFullscreen: true,
            sandbox: 'allow-same-origin allow-scripts allow-popups allow-forms',
            HTMLAttributes: {
                class: 'iframe-wrapper',
            },
            showFooter: true,
            width: '100%',
            height: '450',
        }
    },

    addAttributes() {
        return {
            src: {
                default: null,
            },
            width: {
                default: this.options.width,
                parseHTML: () => this.options.width,
            },
            height: {
                default: this.options.height,
                parseHTML: () => this.options.height,
            },
            frameborder: {
                default: 0,
            },
            allowfullscreen: {
                default: this.options.allowFullscreen,
                parseHTML: () => this.options.allowFullscreen,
            },
            sandbox: {
                default: this.options.sandbox,
                parseHTML: () => this.options.sandbox,
            },
            redirectTo: {
                default: '',
            },
            embedtitle: {
                default: '',
            },
            embedicon: {
                default: '',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'iframe',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', ['iframe', HTMLAttributes]]
    },

    addCommands() {
        return {
            setIframe:
                (options: {
                    src: string
                    embedtitle: string
                    embedicon: string
                    width?: string
                    height?: string
                    redirectTo?: string
                }) =>
                ({ tr, dispatch }) => {
                    const { selection } = tr
                    const node = this.type.create(options)

                    if (dispatch) {
                        tr.replaceRangeWith(selection.from, selection.to, node)
                    }

                    return true
                },
        }
    },

    addNodeView() {
        return VueNodeViewRenderer(CustomIFrame)
    },
})
