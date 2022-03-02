<template>
    <node-view-wrapper>
        <div
            class="rounded w-full px-3 py-3 bg-gray-200 items-center content-center border border-gray-300"
            :class="{ 'outline-primary': selected }"
        >
            <div class="embed-node w-full flex gap-2">
                <a-input
                    v-model:value="linkInput"
                    class="bg-gray-300 text-black embed-input border-transparent"
                    placeholder="Paste Google Doc Link"
                    @keydown.esc="deleteNode"
                >
                </a-input>
                <atlan-button
                    size="sm"
                    class="flex items-center content-center bg-gray-300 text-black"
                    color="secondary"
                    @click="embed"
                >
                    <atlan-icon icon="Gdoc" class="mr-2"></atlan-icon>
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
        </div>
    </node-view-wrapper>
</template>

<script lang="ts">
    import { ref, toRefs, defineComponent } from 'vue'
    import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AtlanButton from '~/components/UI/button.vue'

    export default defineComponent({
        components: {
            NodeViewWrapper,
            AtlanIcon,
            AtlanButton,
        },
        props: { ...nodeViewProps },
        setup(props) {
            const error = ref('')
            const googleDocRegex = new RegExp(
                'https?:\\/\\/(www\\.)?docs.google.com\\/document\\/d\\/([^\\/]*)'
            )

            const { selected, deleteNode, editor } = toRefs(props)

            const linkInput = ref('')

            const validateLinkInput = (link) => googleDocRegex.test(link)

            const getPreviewLink = (documentId) =>
                `https://docs.google.com/document/d/${documentId}/preview`

            const embed = () => {
                if (editor && editor.value) {
                    if (linkInput.value.length === 0) {
                        error.value = 'Please enter a link'
                        return
                    } else if (!validateLinkInput(linkInput.value)) {
                        error.value =
                            "That's not really a valid Google Docs link"
                        return
                    }
                    const capturedParts = googleDocRegex.exec(linkInput.value)
                    if (!capturedParts || capturedParts[2].length === 0) {
                        error.value =
                            "That's not really a valid Google Docs link"
                        return
                    }
                    const documentId = capturedParts[2]
                    deleteNode.value?.()
                    editor.value
                        .chain()
                        .focus()
                        .setIframe({
                            src: getPreviewLink(documentId),
                            redirectTo: linkInput.value,
                        })
                        .run()
                }
            }

            return {
                linkInput,
                embed,
                deleteNode,
                selected,
                error,
            }
        },
    })
</script>
