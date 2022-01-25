<template>
    <node-view-wrapper class='relative py-1'>
        <table>
            <node-view-content as='tbody'/>
        </table>
        <a-tooltip v-if='showHelpers' class='absolute -right-2.5 -top-2.5' placement='right'>
            <template #title>
                Add a Column
            </template>
            <button
                class='ant-btn ant-btn-circle ant-btn-sm'
                tabindex='-1'
                @mousedown.prevent='() => {}'
                @click='() => {
                    if (editor.isEditable) {
                        editor.commands.addColumnAfter()
                    }
                }'
            >
            <span class='flex items-center content-center justify-center'>
                <AtlanIcon icon='Add' class='h-3'/>
            </span>
            </button>
        </a-tooltip>
        <a-tooltip
            v-if='showHelpers'
            class='absolute -left-2.5 -bottom-2.5'
            placement='bottom'
        >
            <template #title>
                Add a Row
            </template>
            <button
                class='ant-btn ant-btn-circle ant-btn-sm'
                tabindex='-1'
                @mousedown.prevent='() => {}'
                @click='() => {
                    if (editor.isEditable) {
                        editor.commands.addRowAfter()
                    }
                }'
            >
            <span class='flex items-center content-center justify-center'>
                <AtlanIcon icon='Add' class='h-3'/>
            </span>
            </button>
        </a-tooltip>
    </node-view-wrapper>
</template>

<script lang='ts'>
    import { defineComponent, ref } from 'vue'
    import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-3'
    import AtlanIcon from '@common/icon/atlanIcon.vue'

    export default defineComponent({
        name: 'CustomTable',
        components: {
            AtlanIcon,
            NodeViewWrapper,
            NodeViewContent
        },
        props: nodeViewProps,
        setup(props) {
            const showHelpers = ref(false)
            const addedRowOrColumn = ref(false)
            props.editor?.on('selectionUpdate', ({ editor: currEditor }) => {
                showHelpers.value = !!(currEditor?.isEditable && currEditor?.isFocused && currEditor?.isActive('customTable'))
            })
            props.editor?.on('focus', ({ editor: currEditor }) => {
                showHelpers.value = !!(currEditor?.isEditable && currEditor?.isFocused && currEditor?.isActive('customTable'))
            })

            return {
                showHelpers,
                addedRowOrColumn,
            }
        }
    })
</script>