import { VueNodeViewRenderer } from '@tiptap/vue-3'
import Component from './component.vue'
import IFrame from '../iframe/extension'
import iconMap from '@common/icon/iconMap'
import { defineComponent, h, VNode } from 'vue'
import {
    NAME_OF_EVENTS,
    README_TRIGGERS,
    TYPE_OF_EVENTS,
    useTrackEvent,
} from '~/modules/editor/analytics/useTrackEvent'

interface ValidateInputFunc {
    (input: string): boolean
}

interface GetIframeLinkFunc {
    (input: string): string
}

interface EmbedOptions {
    title: string
    analyticsKey: string
    icon: keyof typeof iconMap
    validateInput: ValidateInputFunc
    getIframeLink: GetIframeLinkFunc
    customFooter?: VNode
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
            analyticsKey: 'General Embed',
            validateInput(input: string) {
                return input.length > 0
            },
            getIframeLink(input: string) {
                return input
            },
        }
    },
    addNodeView() {
        if (this.options.customFooter) {
            return VueNodeViewRenderer(
                defineComponent({
                    name: 'CustomEmbedWithFooter',
                    setup: (props) => () =>
                        h(Component, props, {
                            customFooter: () => this.options.customFooter,
                        }),
                })
            )
        }
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
                    // useTrackEvent({
                    //     type: TYPE_OF_EVENTS.NODE,
                    //     name: NAME_OF_EVENTS.EMBED_INSERTED,
                    //     trigger: README_TRIGGERS.SLASH_MENU,
                    //     properties: {
                    //         assetType:
                    //             this.editor.options.editorProps.attributes[
                    //                 'data-asset-type'
                    //             ],
                    //         embedService: this.options.title,
                    //     },
                    // })
                    return true
                },
        }
    },
})
