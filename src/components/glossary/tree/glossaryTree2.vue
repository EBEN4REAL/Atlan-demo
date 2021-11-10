<template>
    <a-tree
        :tree-data="list"
        :draggable="true"
        :block-node="true"
        :load-data="onLoadData"
        :loadedKeys="loadedKeys"
        :treeDataSimpleMode="true"
        class="pl-3 bg-transparent"
        :auto-expand-parent="false"
    >
        <template #switcherIcon>
            <AtlanIcon icon="CaretRight" class="my-auto" />
        </template>

        <template #title="entity">
            <GlossaryTreeItem2 :item="entity" />
        </template>
    </a-tree>
</template>
<script lang="ts">
    // library
    import { defineComponent, computed, toRefs } from 'vue'

    import GlossaryTreeItem2 from '@/glossary/tree/glossaryTreeItem2.vue'

    import useGlossaryTree from '~/composables/glossary2/useGlossaryTree'

    export default defineComponent({
        components: {
            GlossaryTreeItem2,
        },
        props: {
            list: {
                type: Array,
                required: false,
                default: () => [],
            },
        },
        setup(props, { emit }) {
            const { list } = toRefs(props)

            const { onLoadData, loadedKeys } = useGlossaryTree({})

            return {
                list,
                onLoadData,
                loadedKeys,
            }
            // data
        },
    })
</script>
<style lang="less" module>
    :global(.ant-tree-switcher_open) {
        transform: rotate(90deg);
    }
</style>
