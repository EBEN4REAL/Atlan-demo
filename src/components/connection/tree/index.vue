<template>
    <LoadingView v-if="isLoading || isValidating"></LoadingView>
    <ErrorView v-else-if="isError"></ErrorView>
    <a-tree
        v-else
        :class="$style.connectionTree"
        :treeData="treeData"
        :blockNode="true"
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        @select="selectNode"
        @expand="expandNode"
    >
        <template #title="{ title, image, type, count }" class="w-full">
            <a-dropdown :trigger="['contextmenu']">
                <div class="flex items-center w-full align-middle">
                    <img
                        :src="image"
                        class="w-4 h-auto mr-2"
                        v-if="type === 'connector'"
                    />
                    <div
                        class="flex justify-between w-full text-sm leading-4 text-gray-600 "
                    >
                        <div>{{ title }}</div>
                        <div
                            v-if="type === 'connector'"
                            class="px-1 text-xs text-gray-500 bg-gray-100 rounded "
                        >
                            {{ count }}
                        </div>
                    </div>
                </div>
                <template #overlay>
                    <a-menu>
                        <a-menu-item key="2" disabled>{{ title }}</a-menu-item>
                        <a-menu-divider></a-menu-divider>
                        <a-menu-item key="open">Open</a-menu-item>
                        <a-menu-divider></a-menu-divider>
                        <a-menu-item key="delete" class="text-red-500"
                            >Delete Connection</a-menu-item
                        >
                    </a-menu>
                </template>
            </a-dropdown>
        </template>
    </a-tree>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import handleTreeExpand from '~/composables/tree/handleTreeExpand'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/index.vue'
    import LoadingView from '@common/loaders/section.vue'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        components: { EmptyView, ErrorView, LoadingView },
        props: {
            treeData: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            isValidating: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            isLoading: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            isError: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            error: {
                required: false,
            },
        },
        emits: ['select'],
        setup(props, { emit }) {
            const router = useRouter()
            const handleEvent = () => {
                router.push('/setup')
            }
            let cacheKey = 'connection_tree'
            const {
                expandedKeys,
                expandedCache,
                selectNode,
                selectedKeys,
                expandNode,
            } = handleTreeExpand(emit, 'connection_tree', true)

            watch(
                () => props.treeData,
                () => {
                    if (props.treeData?.length > 0) {
                        expandedKeys.value = expandedCache
                    }
                }
            )

            return {
                handleEvent,
                expandedKeys,
                selectedKeys,
                selectNode,
                expandNode,
            }
        },
    })
</script>

<style lang="less" module>
    .connectionTree {
        :global(.ant-tree-node-content-wrapper) {
            width: calc(100% - 18px) !important;
        }
    }
</style>
