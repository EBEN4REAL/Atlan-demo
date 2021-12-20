TR
<template>
    <div class="h-full max-h-screen" :class="$style.queryTreeStyles">
        <div class="h-full overflow-x-hidden query-tree-root-div">
            <div v-if="!isLoading && treeData?.length">
                <a-tree
                    :expandedKeys="expandedKeys"
                    :selectedKeys="selectedKeys"
                    :loadedKeys="loadedKeys"
                    :tree-data="treeData"
                    :load-data="onLoadData"
                    :draggable="false"
                    :block-node="true"
                    :auto-expand-parent="false"
                    @select="selectNode"
                    @expand="expandNode"
                >
                    <template #switcherIcon>
                        <AtlanIcon icon="CaretRight" />
                    </template>

                    <template #title="item">
                        <QueryTreeItem
                            :item="item"
                            v-if="item.title !== 'Load more'"
                            :expandedKeys="expandedKeys"
                            :connector="connector"
                            :refreshQueryTree="refreshQueryTree"
                        />
                        <div
                            :data-test-id="'loadMore'"
                            v-else
                            class="flex flex-row w-full h-8 text-sm font-bold leading-5 text-primary"
                            @click="item.click()"
                        >
                            <span v-if="item.isLoading">
                                <LoadingView />
                            </span>
                            <span v-else>{{ item.title }}</span>
                        </div>
                    </template>
                </a-tree>
            </div>
            <div
                v-if="isLoading"
                class="flex items-center justify-center h-full"
                :data-test-id="'loading'"
            >
                <Loader />
            </div>
            <div
                :data-test-id="'noData'"
                v-else-if="
                    !isLoading &&
                    treeData?.length == 0 &&
                    showEmptyState &&
                    !QueriesFetchError
                "
                class="flex flex-col items-center justify-center text-base leading-6 text-center text-gray-500 mt-14"
            >
                <div class="flex flex-col items-center justify-center">
                    <!-- <AtlanIcon
                        v-if="savedQueryType === 'personal'"
                        icon="NoSavedQueriesPersonal"
                        class="h-32 no-svaved-query-icon text-primary"
                    /> -->
                    <AtlanIcon
                        icon="NoSavedQueriesAll"
                        class="h-32 no-svaved-query-icon text-primary"
                    />
                    <p
                        class="my-2 mb-0 mb-6 text-base text-gray-700 max-width-text"
                    >
                        Your collection queries will appear here
                    </p>
                </div>
                <div v-if="hasWritePermission" v-auth="[map.CREATE_COLLECTION]">
                    <a-button
                        @click="toggleCreateQueryModal"
                        class="flex items-center w-48 text-sm text-gray-700 border rounded hover:text-primary h-9"
                    >
                        <span
                            ><AtlanIcon
                                icon="NewQuery"
                                class="h-4 m-0 mr-1 -mt-0.5" /></span
                        >Create a new query</a-button
                    >
                    <p class="my-2 text-sm text-base text-gray-500">OR</p>
                    <a-button
                        @click="createFolderInput"
                        class="flex items-center w-48 text-sm text-gray-700 border rounded hover:text-primary h-9"
                    >
                        <span
                            ><AtlanIcon
                                icon="NewFolder"
                                class="h-4 m-0 mr-1 -mt-0.5" /></span
                        >Create a new folder</a-button
                    >
                </div>
            </div>
            <div
                v-else-if="QueriesFetchError && !isLoading"
                class="flex items-center justify-center h-full"
            >
                <ErrorView :error="errorObjectForCollection">
                    <div class="mt-3">
                        <a-button
                            data-test-id="try-again"
                            size="large"
                            type="primary"
                            ghost
                            @click="
                                () => {
                                    refreshQueryTree()
                                }
                            "
                        >
                            <fa icon="fal sync" class="mr-2"></fa>Try again
                        </a-button>
                    </div>
                </ErrorView>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    // library
    import {
        defineComponent,
        PropType,
        inject,
        Ref,
        toRefs,
        ComputedRef,
        ref,
        watch,
        computed,
    } from 'vue'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

    // components
    import StatusBadge from '@common/badge/status/index.vue'
    import QueryTreeItem from './queryTreeItem.vue'

    // composables
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useConnector } from '~/components/insights/common/composables/useConnector'

    // constant
    import { List as StatusList } from '~/constant/status'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import Loader from '@common/loaders/page.vue'
    import LoadingView from '@common/loaders/section.vue'
    import ErrorView from '@common/error/index.vue'
    import map from '~/constant/accessControl/map'

    export default defineComponent({
        components: {
            Loader,
            LoadingView,
            AtlanIcon,
            AtlanBtn,
            StatusBadge,
            QueryTreeItem,
            ErrorView,
        },
        emits: ['toggleCreateQueryModal', 'createFolderInput'],
        props: {
            treeData: {
                type: Object as PropType<TreeDataItem[]>,
                required: true,
                default: () => {},
            },
            savedQueryType: {
                type: Object as PropType<object>,
                required: true,
            },
            onLoadData: {
                type: Function,
                required: false,
                default: () => {},
            },
            expandNode: {
                type: Function,
                required: false,
                default: () => {},
            },
            selectNode: {
                type: Function,
                required: false,
                default: () => {},
            },
            isLoading: {
                type: Boolean,
                required: false,
                default: false,
            },
            loadedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            selectedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            expandedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
            showEmptyState: {
                type: Boolean,
            },
            refreshQueryTree: {
                type: Function,
                required: false,
                default: () => {},
            },
            QueriesFetchError: {
                type: Object,
            },
            // refetchTreeData: {
            //     type: Function,
            //     required: false,
            //     default: () => {},
            // },
        },
        setup(props, { emit }) {
            const { savedQueryType, QueriesFetchError, isLoading } =
                toRefs(props)
            // data
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const isCollectionCreatedByCurrentUser = inject(
                'isCollectionCreatedByCurrentUser'
            ) as ComputedRef
            const hasCollectionReadPermission = inject(
                'hasCollectionReadPermission'
            ) as ComputedRef
            const hasCollectionWritePermission = inject(
                'hasCollectionWritePermission'
            ) as ComputedRef

            const hasWritePermission = computed(
                () =>
                    hasCollectionWritePermission.value ||
                    isCollectionCreatedByCurrentUser.value
            )

            const { openSavedQueryInNewTab } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )
            const isSavedQueryOpened = (savedQuery: SavedQueryInterface) => {
                let bool = false
                inlineTabs.value.forEach((tab) => {
                    if (tab.key === savedQuery.id) bool = true
                })
                return bool
            }
            const { getConnectorName } = useConnector()
            const connector = ref(
                getConnectorName(
                    activeInlineTab.value?.explorer?.schema?.connectors
                        ?.attributeValue
                )
            )
            const toggleCreateQueryModal = () => {
                emit('toggleCreateQueryModal')
            }

            const createFolderInput = () => {
                emit('createFolderInput')
            }

            return {
                isLoading,
                QueriesFetchError,
                createFolderInput,
                toggleCreateQueryModal,
                savedQueryType,
                StatusList,
                isSavedQueryOpened,
                openSavedQueryInNewTab,
                connector,
                isCollectionCreatedByCurrentUser,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
                hasWritePermission,
                map,
                // selectedKeys,
                // expandedKeys,
                // expandNode,
                // selectNode,
            }
        },
    })
</script>
<style lang="less" module>
    .queryTreeStyles {
        :global(.ant-tree-switcher_open) {
            transform: rotate(90deg);
            margin-bottom: -5px !important;
        }
        :global(.ant-tree-title) {
            width: calc(100% - 1.5rem) !important;
        }
        :global(.ant-tree li ul) {
            padding-left: 16px !important;
        }
        :global(.ant-tree .ant-tree-title) {
            @apply pt-0 pb-0 !important;
        }
        :global(.ant-tree .ant-tree-title) {
            @apply pl-0 pr-0 !important;
        }
        :global(.ant-tree .ant-tree-treenode) {
            @apply p-0 !important;
        }
        :global(.ant-tree.ant-tree-block-node
                li
                .ant-tree-node-content-wrapper) {
            @apply w-full !important;
        }
        :global(.ant-tree li .ant-tree-node-content-wrapper:hover) {
            @apply bg-gray-light;
        }
        :global(.ant-tree-switcher) {
            width: 20px !important;
        }

        :global(.ant-tree .ant-tree-node-content-wrapper) {
            padding: 0 !important;
            overflow: hidden;
        }

        :global(.ant-tree-treenode) {
            padding-bottom: 0px !important;
            @apply hover:bg-gray-light rounded !important;
            transition: none !important;
        }
        :global(.ant-tree-node-content-wrapper) {
            @apply hover:bg-gray-light rounded !important;
            transition: none !important;
        }

        :global(.ant-tree-node-selected) {
            @apply bg-primary-selected-focus !important;
            @apply hover:bg-primary-selected-focus !important;
            // @apply hover:bg-gray-light !important;
        }
        :global(.ant-tree-treenode-selected) {
            @apply bg-primary-selected-focus !important;
            @apply hover:bg-primary-selected-focus !important;
        }
    }
</style>
<style lang="less" scoped>
    .no-svaved-query-icon {
        @apply w-32 !important;
    }
    .max-width-text {
        max-width: 216px;
    }
</style>
