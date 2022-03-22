<template>
    <node-view-wrapper>
        <div
            class="rounded w-full px-3 py-3 bg-gray-200 items-center content-center"
            :class="{ 'outline-primary': selected }"
        >
            <div class="embed-node w-full flex gap-2">
                <a-input
                    v-model:value="linkInput"
                    class="border-transparent"
                    :placeholder="`Paste ${options.title} Link`"
                    @keydown.esc="deleteNode"
                    @keydown.enter="embed"
                >
                </a-input>
                <atlan-button
                    size="sm"
                    class="flex items-center content-center border-transparent"
                    color="secondary"
                    @click="embed"
                >
                    <atlan-icon :icon="options.icon" class="mr-2"></atlan-icon>
                    Embed
                </atlan-button>
                <atlan-button
                    size="sm"
                    color="minimal"
                    padding="compact"
                    class="px-0"
                    @click="deleteNode"
                >
                    <atlan-icon icon="Delete" />
                </atlan-button>
            </div>
            <div v-if="error" class="mt-2">
                <p class="text-red-500">
                    {{ error }}
                </p>
            </div>
            <slot name="customFooter"></slot>
        </div>
    </node-view-wrapper>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
    import AtlanIcon from '@common/icon/atlanIcon.vue'
    import AtlanButton from '@/UI/button.vue'
    import {
        useTrackEvent,
        TYPE_OF_EVENTS,
        README_TRIGGERS,
        NAME_OF_EVENTS,
    } from '~/modules/editor/analytics/useTrackEvent'

    export default defineComponent({
        components: {
            NodeViewWrapper,
            AtlanIcon,
            AtlanButton,
        },
        props: { ...nodeViewProps },
        setup(props) {
            const { selected, deleteNode, editor, extension } = toRefs(props)

            const options = computed(() => extension.value?.options)
            const error = ref('')

            const linkInput = ref('')

            const embed = () => {
                if (editor && editor.value) {
                    if (linkInput.value.length === 0) {
                        error.value = 'Please enter a link'
                        return
                    } else if (!options.value.validateInput(linkInput.value)) {
                        error.value =
                            options.value.error ??
                            `That's not really a valid ${options.value.title} link`
                        return
                    }
                    deleteNode.value?.()
                    editor.value
                        .chain()
                        .focus()
                        .setIframe({
                            src: options.value.getIframeLink(linkInput.value),
                            redirectTo: linkInput.value,
                            embedtitle: options.value?.title,
                            embedicon: options.value?.icon,
                            analyticskey: options.value?.analyticsKey,
                        })
                        .run()
                    useTrackEvent({
                        type: TYPE_OF_EVENTS.EMBED,
                        name: NAME_OF_EVENTS.IFRAME_INSERTED,
                        trigger: README_TRIGGERS.SLASH_MENU,
                        properties: {
                            assetType:
                                editor.value.options.editorProps.attributes[
                                    'data-asset-type'
                                ],
                            embedService: options.value?.analyticsKey,
                        },
                    })
                }
            }

            return {
                linkInput,
                embed,
                deleteNode,
                selected,
                error,
                options,
            }
        },
    })
</script>
