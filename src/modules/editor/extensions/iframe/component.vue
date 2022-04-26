<template>
    <node-view-wrapper>
        <div class="rounded" :class="{ 'outline-2 outline-primary': selected }">
            <iframe v-bind="attrs" class="rounded-t" />
            <div
                v-if="showFooter"
                class="bg-gray-200 rounded-b bottom-0 w-full flex h-8 px-2 items-center content-center border-t border-gray-200"
            >
                <div class="flex items-center content-center">
                    <atlan-icon :icon="node.attrs.embedicon" />
                    <span class="font-bold text-gray-700 ml-1">
                        {{ node.attrs.embedtitle }}
                    </span>
                </div>
                <div
                    v-if="redirectTo"
                    class="flex items-center content-center ml-auto"
                >
                    <a
                        class="text-gray-700 mr-1"
                        style="text-decoration: none"
                        :href="redirectTo"
                        target="_blank"
                        @click.prevent="handleOpenCtaClick"
                    >
                        Open
                    </a>
                    <atlan-icon icon="External" />
                </div>
            </div>
        </div>
    </node-view-wrapper>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
    import AtlanIcon from '@common/icon/atlanIcon.vue'
    import {
        useTrackEvent,
        TYPE_OF_EVENTS,
        NAME_OF_EVENTS,
        README_TRIGGERS,
    } from '~/modules/editor/analytics/useTrackEvent'

    export default defineComponent({
        name: 'CustomIFrame',
        components: { AtlanIcon, NodeViewWrapper },
        props: {
            ...nodeViewProps,
        },
        setup(props) {
            const { node, selected, extension, editor } = toRefs(props)

            const options = computed(() => extension.value?.options)

            const attrs = computed(() => ({
                ...node.value?.attrs,
                ...extension.value?.options.HTMLAttributes,
            }))

            const showFooter = computed(() => options.value.showFooter)

            const redirectTo = computed(() => node.value?.attrs.redirectTo)

            const handleOpenCtaClick = () => {
                useTrackEvent({
                    type: TYPE_OF_EVENTS.EMBED,
                    name: NAME_OF_EVENTS.OPEN_CTA_CLICKED,
                    trigger: README_TRIGGERS.SLASH_MENU,
                    properties: {
                        assetType:
                            editor.value?.options.editorProps.attributes[
                                'data-asset-type'
                            ],
                        embedService: node.value?.attrs.analyticskey
                            ? node.value?.attrs.analyticskey
                            : node.value?.attrs.embedtitle,
                    },
                })
                window.open(redirectTo.value)
            }

            return {
                attrs,
                selected,
                showFooter,
                redirectTo,
                handleOpenCtaClick,
            }
        },
    })
</script>

<style scoped></style>
