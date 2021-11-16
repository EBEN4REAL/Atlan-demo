<template>
    <a-tree
        :tree-data="treeData"
        :draggable="true"
        :block-node="true"
        :load-data="onLoadData"
        :treeDataSimpleMode="true"
        @select="selectNode"
        :auto-expand-parent="false"
        @expand="expandNode"
        :loadedKeys="loadedKeys"
        :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys"
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
    import { defineComponent, computed, toRefs, onMounted } from 'vue'

    import GlossaryTreeItem2 from './glossaryTreeItem2.vue'

    import useGlossaryTree from '~/composables/glossary2/useGlossaryTree'
    import { useRouter } from 'vue-router'

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
        emits: ['select'],
        setup(props, { emit }) {
            const router = useRouter()

            const {
                onLoadData,
                loadedKeys,
                expandedKeys,
                expandNode,
                selectedKeys,
                selectNode,
                addNode,
                initTreeData,
                treeData,
            } = useGlossaryTree({ emit })

            onMounted(() => {
                initTreeData()
            })

            const addGlossary = (asset) => {
                addNode(asset)
            }

            return {
                onLoadData,
                loadedKeys,
                expandNode,
                expandedKeys,
                selectNode,
                selectedKeys,
                addGlossary,
                treeData,
                addNode,
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
