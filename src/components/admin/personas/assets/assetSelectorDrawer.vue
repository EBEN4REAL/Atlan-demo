<template>
    <a-drawer
        placement="right"
        :destroyOnClose="true"
        :visible="isVisible"
        :get-container="false"
        :closable="false"
        :mask="false"
        :class="$style.drawerStyle"
        :width="420"
    >
        <div class="flex flex-col h-full">
            <AtlanBtn
                class="mt-2 ml-auto"
                size="sm"
                padding="compact"
                color="light"
                @click="() => (isVisible = false)"
                >Close</AtlanBtn
            >

            <span class="p-4 text-lg font-bold text-gray-700"
                >Select Assets</span
            >
            <a-divider class="m-0" />
            <div class="h-full p-4 overflow-y-auto">
                <SchemaTree
                    :tree-data="treeData"
                    checkable="true"
                    :on-load-data="onLoadData"
                    :select-node="selectNode"
                    :expand-node="expandNode"
                    :is-loading="isInitingTree"
                    :loaded-keys="loadedKeys"
                    :selected-keys="selectedKeys"
                    :expanded-keys="expandedKeys"
                    v-model:checkedKeys="checkedKeys"
                />
            </div>
            <div class="flex items-center justify-end m-2 gap-x-2">
                <AtlanBtn
                    size="sm"
                    padding="compact"
                    color="secondary"
                    @click="() => (isVisible = false)"
                    >Close</AtlanBtn
                >
                <AtlanBtn
                    size="sm"
                    padding="compact"
                    @click="() => (isVisible = false)"
                    >Save</AtlanBtn
                >
            </div>
        </div>
    </a-drawer>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import SchemaTree from '@/insights/explorers/schema/schemaTree.vue'

    import useSchemaExplorerTree from '@/insights/explorers/schema/composables/useSchemaExplorerTree'

    export default defineComponent({
        name: 'AssetSelector',
        components: { AtlanBtn, SchemaTree },
        props: {
            connectionQualifiedName: {
                type: String,
                required: true,
            },
            assets: {
                type: Array as PropType<string[]>,
                required: true,
            },
            visible: {
                type: Boolean,
                default: () => false,
            },
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
            const { visible, connectionQualifiedName } = toRefs(props)
            const isVisible = computed({
                get: () => visible.value,
                set: (val) => {
                    emit('update:visible', val)
                },
            })

            const checkedKeys = ref([])
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
                isVisible,
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

<style lang="less" module>
    .drawerStyle {
        :global(.ant-drawer-body) {
            overflow-y: hidden;
            height: 100%;
        }
    }
</style>
