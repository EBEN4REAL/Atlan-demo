<template>
    <LoadingView v-if="isLoading || isValidating"></LoadingView>
    <ErrorView v-else-if="isError"></ErrorView>
    <a-tree
        v-else
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :class="$style.connectionTree"
        :tree-data="treeData"
        :block-node="true"
        @select="selectNode"
        @expand="expandNode"
    >
        <template #title="{ title, image, type, count }" class="w-full">
            <a-dropdown :trigger="['contextmenu']">
                <div class="flex items-center w-full align-middle">
                    <img
                        v-if="type === 'connector'"
                        :src="image"
                        class="w-4 h-auto mr-2"
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
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/index.vue'
    import LoadingView from '@common/loaders/section.vue'
    import { useRouter } from 'vue-router'
    import handleTreeExpand from '~/composables/tree/handleTreeExpand'

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
            const cacheKey = 'connection_tree'
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
