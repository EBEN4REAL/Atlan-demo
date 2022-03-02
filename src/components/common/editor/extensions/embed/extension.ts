import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from './component.vue'
import IFrame from '../iframe/extension'

interface ValidateInputFunc {
    (input: string): boolean
}

interface GetIframeLinkFunc {
    (input: string): string
}

interface EmbedOptions {
    title: string
    icon: string
    validateInput: ValidateInputFunc
    getIframeLink: GetIframeLinkFunc
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        embeds: {
            /**
             * Add a Google Doc
             */
            insertEmbed: (options: { src: string }) => ReturnType
        }
    }
}

export default IFrame.extend<EmbedOptions>({
    name: 'embed',
    addOptions() {
        return {
            ...this.parent?.(),
            title: 'General Embed',
            icon: 'Documentation',
            validateInput(input: string) {
                return input.length > 0
            },
            getIframeLink(input: string) {
                return input
            },
        }
    },
    addNodeView() {
        return VueNodeViewRenderer(Component)
    },
    addCommands() {
        return {
            insertEmbed:
                (options: { src: string }) =>
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
})
