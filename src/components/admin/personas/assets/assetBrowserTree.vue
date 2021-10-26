<template>
    <div></div>
    <!-- <SchemaTree
        :tree-data="treeData"
        :checkable="true"
        :on-load-data="onLoadData"
        :select-node="selectNode"
        :expand-node="expandNode"
        :is-loading="isInitingTree"
        :loaded-keys="loadedKeys"
        :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys"
        v-model:checkedKeys="checkedKeys"
    /> -->
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import SchemaTree from '@/insights/explorers/schema/schemaTree.vue'

    import useSchemaExplorerTree from '@/insights/explorers/schema/composables/useSchemaExplorerTree'

    export default defineComponent({
        name: 'AssetBrowserTree',
        components: { AtlanBtn, SchemaTree },
        props: {
            connectionQfName: {
                type: String,
                required: true,
            },
            assets: {
                type: Array as PropType<string[]>,
                required: true,
            },
        },
        emits: ['update:assets'],
        setup(props, { emit }) {
            const { assets, connectionQfName: connectionQualifiedName } =
                toRefs(props)

            const checkedKeys = computed({
                get: () => assets.value,
                set: (val) => emit('update:assets', val),
            })

            const {
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
            } = useSchemaExplorerTree({
                emit,
                // initSelectedKeys,
                connectionQualifiedName,
                // databaseQualifiedName,
                // schemaQualifiedName,
            })

            return {
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
                checkedKeys,
            }
        },
    })
</script>
