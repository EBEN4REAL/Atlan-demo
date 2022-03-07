<template>
    <node-view-wrapper
        as="span"
        class="cursor-pointer"
        v-bind="{ ...attrs, ...htmlAttrs }"
    >
        <user-popover v-if="isUser" :item="label" placement="top"
            >@{{ label }}</user-popover
        >
        <group-popover v-else :item="label" placement="top"
            >@{{ label }}</group-popover
        >
    </node-view-wrapper>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
    import UserPopover from '~/components/common/popover/user/user.vue'
    import GroupPopover from '~/components/common/popover/user/groups.vue'

    export default defineComponent({
        name: 'MentionNode',
        components: {
            NodeViewWrapper,
            UserPopover,
            GroupPopover,
        },
        props: {
            ...nodeViewProps,
        },
        setup(props) {
            const { extension, node } = toRefs(props)
            const modifiedAttrs = computed(() => {
                const tempObj = {}
                Object.keys(node.value?.attrs).forEach((key) => {
                    tempObj[`data-${key}`] = node.value?.attrs[key]
                })
                return tempObj
            })
            const isUser = computed(() => node.value?.attrs['is-user'])
            return {
                htmlAttrs: extension.value?.options.HTMLAttributes ?? {},
                label: node.value?.attrs.id,
                attrs: modifiedAttrs,
                isUser,
            }
        },
    })
</script>

<style scoped></style>
