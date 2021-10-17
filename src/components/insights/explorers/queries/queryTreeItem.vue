<template>
    <div :class="`w-full group ${item.qualifiedName}`">
        <div class="flex justify-between w-full overflow-hidden">
            <div class="flex w-full m-0">
                <div
                    v-if="item.typeName === 'QueryFolder'"
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
                    <!--FOLDER NODE -->

                    <div class="parent-ellipsis-container py-1.5">
                        <div class="flex w-full">
                            <AtlanIcon
                                :icon="
                                    expandedKeys.find((key) => key === item.key)
                                        ? 'FolderOpen'
                                        : 'FolderClosed'
                                "
                                class="w-5 h-5 my-auto mr-1"
                            ></AtlanIcon>
                            <span
                                class="mb-0 text-sm text-gray-700  parent-ellipsis-container-base"
                            >
                                {{ title(item) }}</span
                            >
                            <div
                                class="absolute top-0 right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                            >
                                <a-dropdown
                                    :trigger="['click']"
                                    @click.stop="() => {}"
                                >
                                    <div class="pl-2">
                                        <AtlanIcon
                                            icon="KebabMenu"
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </div>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item
                                                key="rename"
                                                @click="renameFolder"
                                                >Rename Folder</a-menu-item
                                            >
                                            <a-menu-item
                                                key="newQuery"
                                                @click="newQuery"
                                                >New Query</a-menu-item
                                            >
                                            <a-menu-item
                                                v-if="
                                                    savedQueryType ===
                                                    'personal'
                                                "
                                                key="public"
                                                @click="
                                                    showPublishPopover = true
                                                "
                                                >Make folder public</a-menu-item
                                            >
                                            <a-menu-item
                                                key="deleteFolder"
                                                class="text-red-600"
                                                @click="
                                                    showDeletePopover = true
                                                "
                                                >Delete Folder</a-menu-item
                                            >
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <!--Empty NODE -->
                <div
                    v-else-if="item.typeName === 'Empty'"
                    class="text-sm font-bold text-gray-500"
                >
                    {{ item.title }}
                </div>
                <!------------------------------->
                <!-- Popover Allowed -->
                <a-popover
                    placement="rightTop"
                    v-else-if="item.typeName === 'Query'"
                >
                    <template #content>
                        <div>
                            <QueryItemPopover :item="item" />
                        </div>
                    </template>
                    <div
                        class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                    >
                        <!--SAVED QUERY NODE -->
                        <!--For Others -->
                        <div class="parent-ellipsis-container py-1.5">
                            <span
                                class="mb-0 text-sm text-gray-700  parent-ellipsis-container-base"
                            >
                                {{ title(item) }}
                            </span>
                            <StatusBadge
                                v-if="certificateStatus(item)"
                                :key="item?.guid"
                                :show-no-status="false"
                                :status-id="certificateStatus(item)"
                                class="
                                    ml-1.5
                                    mb-1
                                    parent-ellipsis-container-extension
                                "
                            ></StatusBadge>
                            <div
                                class="absolute flex items-center h-full text-gray-500 transition duration-300 opacity-0  right-6 margin-align-top group-hover:opacity-100"
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light via-gray-light'
                                "
                            >
                                <div
                                    class="pl-2 ml-24"
                                    @click.stop="
                                        () => actionClick('info', item)
                                    "
                                >
                                    <a-tooltip placement="top">
                                        <template #title
                                            >Open preview sidebar</template
                                        >
                                        <AtlanIcon
                                            icon="Info"
                                            :class="
                                                item?.selected
                                                    ? 'tree-light-color'
                                                    : ''
                                            "
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                            </div>
                            <div
                                class="absolute top-0 right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                            >
                                <a-dropdown
                                    :trigger="['click']"
                                    @click.stop="() => {}"
                                >
                                    <div class="pl-2">
                                        <AtlanIcon
                                            icon="KebabMenu"
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </div>
                                    <template #overlay>
                                        <a-menu>
                                            <a-menu-item
                                                key="rename"
                                                @click="renameFolder"
                                                >Rename Query</a-menu-item
                                            >

                                            <a-menu-item
                                                v-if="
                                                    canUserDeleteFolder(
                                                        item?.attributes?.owner
                                                    )
                                                "
                                                key="deleteFolder"
                                                class="text-red-600"
                                                @click="
                                                    showDeletePopover = true
                                                "
                                                >Delete Query</a-menu-item
                                            >
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </div>
                        </div>
                        <!------------------------------->
                    </div>
                </a-popover>
                <!-- ---------------- -->
            </div>
        </div>
    </div>
    <a-popover :visible="showDeletePopover" placement="right">
        <template #content>
            <TreeDeletePopover
                :item="item"
                @cancel="showDeletePopover = false"
                @delete="() => delteItem(item.typeName)"
            />
        </template>
    </a-popover>
    <a-popover :visible="showPublishPopover" placement="right">
        <template #content>
            <PublishFolderPopover
                :item="item"
                @cancel="showPublishPopover = false"
                @publish="publishFolder"
            />
        </template>
    </a-popover>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ComputedRef,
        Ref,
        inject,
        toRaw,
        watch,
        ref,
    } from 'vue'
    import { message } from 'ant-design-vue'

    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'

    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { useAccess } from '~/components/insights/common/composables/useAccess'
    import QueryItemPopover from '~/components/insights/explorers/queries/queryItemPopover.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import TreeDeletePopover from '~/components/insights/common/treeDeletePopover.vue'
    import PublishFolderPopover from '~/components/insights/common/publishFolderPopover.vue'

    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { assetInterface } from '~/types/assets/asset.interface'

    import { Classification } from '~/api/atlas/classification'
    import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants'
    import { Insights } from '~/services/atlas/api/insights'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {
            QueryItemPopover,
            StatusBadge,
            TreeDeletePopover,
            PublishFolderPopover,
        },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            expandedKeys: {
                type: Array as PropType<string[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props) {
            const { canUserDeleteFolder } = useAccess()
            const { expandedKeys, item } = toRefs(props)
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
                certificateStatus,
            } = useAssetInfo()
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const toggleCreateQueryModal = inject<(guid: string) => void>(
                'toggleCreateQueryModal'
            )
            const savedQueryType = inject('savedQueryType') as Ref<
                'all' | 'personal'
            >
            const refetchParentNode = inject<
                (
                    guid: string | 'root',
                    type: 'query' | 'queryFolder',
                    tree?: 'personal' | 'all'
                ) => void
            >('refetchParentNode', () => {})
            const { isSameNodeOpenedInSidebar } = useSchema()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )
            const showDeletePopover = ref(false)
            const showPublishPopover = ref(false)

            const actionClick = (action: string, t: assetInterface) => {
                /* Here t->enity->assetInfo */
                switch (action) {
                    case 'info': {
                        // i button clicked on the same node -> close the sidebar
                        if (isSameNodeOpenedInSidebar(t, activeInlineTab)) {
                            /* Close it if it is already opened */
                            closeAssetSidebar(activeInlineTab.value)
                        } else {
                            const activeInlineTabCopy: activeInlineTabInterface =
                                Object.assign({}, activeInlineTab.value)
                            activeInlineTabCopy.assetSidebar.assetInfo = t
                            activeInlineTabCopy.assetSidebar.isVisible = true
                            openAssetSidebar(activeInlineTabCopy)
                        }

                        break
                    }
                    case 'bookmark': {
                        break
                    }
                }
            }

            const newQuery = () => {
                if (toggleCreateQueryModal) {
                    toggleCreateQueryModal(
                        props.item.guid,
                        props.item.qualifiedName
                    )
                }
            }
            const publishFolder = () => {
                const payload = ref([
                    {
                        entityGuid: props.item.guid as string,
                        attributes: {},
                        propagate: true,
                        removePropagationsOnEntityDelete: true,
                        typeName: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                        validityPeriods: [],
                    },
                ])

                const { error, isLoading } = Classification.linkClassification({
                    cache: undefined,
                    payload,
                    entityGuid: props.item.guid,
                })

                watch([isLoading], () => {
                    if (isLoading.value == false && !error.value) {
                        useAddEvent('insights', 'folder', 'space_changed', {
                            finalSpace: 'public',
                        })
                        message.success({
                            content: `${item.value?.attributes?.name} was made public!`,
                        })
                        refetchParentNode(props.item.guid, 'queryFolder')
                    }
                })
            }
            const renameFolder = () => {
                useAddEvent('insights', 'folder', 'renamed', undefined)
                const orignalName = item.value.attributes.name
                const parentNode = document.getElementsByClassName(
                    `${item.value.qualifiedName}`
                )[0]

                const childNode = parentNode?.firstChild as HTMLElement
                childNode?.classList?.add('hidden')

                const input = document.createElement('input')
                input.setAttribute(
                    'class',
                    `outline-none border py-0 px-1 rounded mx-0 my-1 w-auto`
                )
                input.classList.add(`${item.value.qualifiedName}-rename-input`)

                parentNode?.prepend(input)
                input.focus()
                input.value = ''
                input.value = item.value.attributes?.name

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        parentNode?.removeChild(input)
                        childNode?.classList?.remove('hidden')
                    }
                    if (e.key === 'Enter') {
                        if (input.value && input.value !== orignalName) {
                            item.value.attributes.name = input.value
                            const { data, error } = Insights.CreateSavedQuery({
                                entity: item.value.entity,
                            })
                            watch(error, (newError) => {
                                if (newError) {
                                    item.value.attributes.name = orignalName
                                }
                            })
                        }
                        input.value = ''
                        try {
                            parentNode?.removeChild(input)
                        } catch {}
                        childNode?.classList?.remove('hidden')
                    }
                })
                input.addEventListener('blur', (e) => {
                    if (input.value) {
                        item.value.attributes.name = input.value
                        const { data, error } = Insights.CreateSavedQuery({
                            entiy: item.value.entity,
                        })
                        watch(error, (newError) => {
                            if (newError) {
                                item.value.attributes.name = orignalName
                            }
                        })
                    }
                    try {
                        parentNode?.removeChild(input)
                    } catch {}
                    childNode?.classList?.remove('hidden')
                })
            }

            const delteItem = (type: 'Query' | 'QueryFolder') => {
                const { data, error } = Insights.DeleteEntity(item.value.guid)

                watch([data, error], ([newData, newError]) => {
                    if (newData && !newError) {
                        useAddEvent('insights', 'folder', 'deleted', undefined)
                        message.success({
                            content: `${item.value?.attributes?.name} deleted!`,
                        })
                        refetchParentNode(
                            props.item.guid,
                            type === 'Query' ? 'query' : 'queryFolder',
                            savedQueryType.value
                        )
                    }
                })
            }
            return {
                canUserDeleteFolder,
                certificateStatus,
                renameFolder,
                delteItem,
                publishFolder,
                newQuery,
                savedQueryType,
                item,
                expandedKeys,
                activeInlineTab,
                isPrimary,
                title,
                assetType,
                dataType,
                dataTypeImage,
                actionClick,
                dataTypeImageForColumn,
                showDeletePopover,
                showPublishPopover,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tree-container {
        overflow: hidden;
    }

    .popover-width {
        max-width: 440px;
        min-height: 228px;
    }
    .margin-align-top {
        margin-top: -1px;
    }
    .primary-key-color {
        color: #3ca5bc;
    }
    /* Tree selection actions bg change */
    .tree-light-color {
        background-color: #dbe9fe;
    }
    .via-tree-light-color {
        --tw-gradient-stops: var(--tw-gradient-from), #dbe9fe,
            var(--tw-gradient-to, rgba(244, 246, 253, 0)) !important;
    }
    .from-tree-light-color {
        --tw-gradient-from: #dbe9fe !important;
    }
    .parent-ellipsis-container {
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .parent-ellipsis-container-extension {
        flex-shrink: 0;
    }

    /* ------------------------------- */
</style>
<style lang="less" module>
    :global(.ant-popover-inner-content) {
        // min-width: 440px !important;
        max-width: none !important;
        // min-height: 228px !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
