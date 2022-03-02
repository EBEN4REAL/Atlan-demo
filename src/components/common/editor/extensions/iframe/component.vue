<template>
    <node-view-wrapper
        class="rounded relative"
        :class="{ 'outline-primary': selected }"
    >
        <iframe v-bind="attrs" />
        <div
            v-if="showFooter"
            class="absolute bg-gray-200 bottom-0 w-full flex h-8 px-2 items-center content-center border-t border-gray-200"
        >
            <div class="flex items-center content-center">
                <atlan-icon icon="Gdoc" />
                <span class="font-bold text-gray-700 ml-1">Google Docs</span>
            </div>
            <div
                v-if="redirectTo"
                class="flex items-center content-center ml-auto"
            >
                <atlan-icon icon="OpenPreview" />
                <a
                    class="text-gray-700 ml-1"
                    style="text-decoration: none"
                    :href="redirectTo"
                    target="_blank"
                >
                    Open
                </a>
            </div>
        </div>
    </node-view-wrapper>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
    import AtlanIcon from '@common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'CustomIFrame',
        components: { AtlanIcon, NodeViewWrapper },
        props: {
            ...nodeViewProps,
        },
        setup(props) {
            const { node, selected, extension } = toRefs(props)

            const attrs = computed(() => ({
                ...node.value?.attrs,
                ...extension.value?.options.HTMLAttributes,
            }))

            const showFooter = computed(
                () => extension.value?.options.showFooter
            )

            const redirectTo = computed(() => node.value?.attrs.redirectTo)

            return { attrs, selected, showFooter, redirectTo }
        },
    })
</script>

<style scoped></style>
