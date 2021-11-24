<template>
    <div>
        <div class="pb-4">
            <SearchAndFilter
                v-model:value="queryText"
                :placeholder="`Search in assets `"
                size="minimal"
                class=""
            >
                <template #filter>
                    <div></div>
                </template>
            </SearchAndFilter>
        </div>

        <div class="w-full h-full">
            <SchemaTree
                v-if="treeData.length > 0"
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
                :checkStrictly="true"
                :hoverActions="false"
            />
            <div
                v-else-if="treeData.length == 0"
                class="flex flex-col items-center justify-center h-full text-base leading-6 text-center text-gray-500 "
            >
                <AtlanIcon icon="NoSchema" class="no-schema-icon h-28" />
                <p class="mt-6 mb-0 text-base text-gray-700">
                    No assets available
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        toRefs,
        ref,
        watch,
    } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import SchemaTree from '@/insights/explorers/schema/schemaTree.vue'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import useSchemaExplorerTree from '@/insights/explorers/schema/composables/useSchemaExplorerTree'

    export default defineComponent({
        name: 'AssetBrowserTree',
        components: {
            AtlanBtn,
            SearchAndFilter,
            SchemaTree,
        },
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
            const queryText = ref('')
            const searchResultType = ref('all')

            const checkedKeys = computed({
                get: () => assets.value,
                set: (val) => {
                    console.log(val, 'val')
                    emit('update:assets', val.checked)
                },
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
                queryText,
                searchResultType,
                connectionQualifiedName,
                // databaseQualifiedName,
                // schemaQualifiedName,
            })
            watch(queryText, () => {
                console.log('queryText Changed', queryText.value)
            })
            return {
                queryText,
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
