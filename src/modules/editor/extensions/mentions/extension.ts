import Mention from '@tiptap/extension-mention'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import MentionNode from './mention.vue'
import {
    NAME_OF_EVENTS,
    README_TRIGGERS,
    TYPE_OF_EVENTS,
    useTrackEvent,
} from '~/modules/editor/analytics/useTrackEvent'

export const CustomMention = Mention.extend({
    addOptions() {
        const parentOptions = this.parent?.()
        return {
            ...parentOptions,
            suggestion: {
                ...parentOptions?.suggestion,
                command({ editor, range, props }) {
                    parentOptions?.suggestion?.command({ editor, range, props })
                    useTrackEvent({
                        type: TYPE_OF_EVENTS.NODE,
                        name: NAME_OF_EVENTS.MENTION_INSERTED,
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
        }
    },
    addAttributes() {
        return {
            ...this.parent?.(),
            'is-user': {
                default: true,
                parseHTML: (element) =>
                    element.getAttribute('data-is-user') === 'true',
                renderHTML: (attributes) => {
                    if (!attributes['is-user']) {
                        return {}
                    }

                    return {
                        'data-is-user': attributes['is-user'],
                    }
                },
            },
        }
    },
    addNodeView() {
        return VueNodeViewRenderer(MentionNode)
    },
    addCommands() {
        return {
            insertMention:
                () =>
                ({ commands }) => {
                    return commands.insertContent('@')
                },
        }
    },
})
