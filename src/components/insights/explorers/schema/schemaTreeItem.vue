<template>
    <div class="w-full group py-1.5">
        <div class="flex justify-between w-full overflow-hidden">
            <!-- Popover Allowed -->
            <div
                class="flex w-full m-0"
                v-if="isPopoverAllowed(item?.typeName)"
            >
                <a-popover placement="right">
                    <template #content>
                        <div>
                            <SchemaTreeItemPopover :item="item" />
                        </div>
                    </template>
                    <div
                        class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                    >
                        <!--For Column-->
                        <div
                            v-if="assetType(item) == 'Column'"
                            class="relative flex items-center justify-between w-full  z"
                        >
                            <div class="relative parent-ellipsis-container">
                                <component
                                    :is="dataTypeImage(item)"
                                    class="
                                        flex-none
                                        w-auto
                                        h-4
                                        mr-1
                                        -mt-0.5
                                        text-gray-500
                                    "
                                ></component>
                                <span
                                    class="mb-0 text-sm text-gray-700  parent-ellipsis-container-base"
                                    >{{ title(item) }}</span
                                >
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
                            </div>
                            <div
                                class="absolute right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light via-gray-light'
                                "
                                @click.stop="() => {}"
                            >
                                <div
                                    class="pl-2 ml-20"
                                    @click="() => actionClick('add', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title
                                            >Place name in editor</template
                                        >
                                        <AtlanIcon
                                            icon="AddAssetName"
                                            class="w-4 h-4 my-auto"
                                            :class="
                                                item?.selected
                                                    ? 'tree-light-color'
                                                    : 'bg-gray-light'
                                            "
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                                <!-- Add pr-2 for next icon -->
                                <div
                                    class="pl-2"
                                    :class="
                                        item?.selected
                                            ? 'tree-light-color'
                                            : 'bg-gray-light'
                                    "
                                    @click="() => actionClick('info', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
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
                                <!-- <div
                                    class="bg-gray-light"
                                    @click.stop="
                                        () => actionClick('bookmark', item)
                                    "
                                >
                                    <a-tooltip placement="top">
                                        <template #title>Bookmark</template>

                                        <AtlanIcon
                                            icon="BookmarkOutlined"
                                            :class="
                                                item?.selected
                                                    ? 'tree-light-color'
                                                    : ''
                                            "
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>-->
                            </div>
                            <div
                                class="flex items-center text-xs text-gray-500"
                            >
                                <div
                                    class="flex items-center"
                                    v-if="isPrimary(item)"
                                >
                                    <div class="flex items-center mr-2">
                                        <AtlanIcon
                                            icon="PrimaryKey"
                                            class="w-4 h-4 my-auto mr-1  primary-key-color"
                                        ></AtlanIcon>
                                        <span class="primary-key-color"
                                            >Pkey</span
                                        >
                                    </div>
                                </div>
                                <span>{{ dataType(item) }}</span>
                            </div>
                        </div>
                        <!------------------------------->
                        <!--For Others -->
                        <div v-else class="parent-ellipsis-container">
                            <AtlanIcon
                                :icon="assetType(item)"
                                class="
                                    w-4
                                    h-4
                                    mr-1.5
                                    -mt-0.5
                                    parent-ellipsis-container-extension
                                "
                            ></AtlanIcon>

                            <span
                                class="mb-0 text-sm text-gray-700  parent-ellipsis-container-base"
                                >{{ title(item) }}</span
                            >
                            <StatusBadge
                                v-if="certificateStatus(item)"
                                :key="item?.guid"
                                :show-no-status="false"
                                :status-id="certificateStatus(item)"
                                class="
                                    ml-1.5
                                    -mt-0.5
                                    parent-ellipsis-container-extension
                                "
                            ></StatusBadge>

                            <div
                                class="absolute right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                                @click.stop="() => {}"
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light via-gray-light'
                                "
                            >
                                <div
                                    class="pl-2 ml-24"
                                    @click="() => actionClick('add', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title
                                            >Place name in editor</template
                                        >
                                        <AtlanIcon
                                            icon="AddAssetName"
                                            class="w-4 h-4 my-auto"
                                            :class="
                                                item?.selected
                                                    ? 'tree-light-color'
                                                    : 'bg-gray-light'
                                            "
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                                <div
                                    class="pl-2 pr-2"
                                    :class="
                                        item?.selected
                                            ? 'tree-light-color'
                                            : 'bg-gray-light'
                                    "
                                    @click="() => actionClick('info', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
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
                                <!-- Add pr-2 for next icon -->
                                <div
                                    class
                                    @click="() => actionClick('play', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title>Preview data</template>

                                        <AtlanIcon
                                            icon="Play"
                                            :class="
                                                item?.selected
                                                    ? 'tree-light-color'
                                                    : ''
                                            "
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                                <!-- <div
                                    class="bg-gray-light"
                                    @click.stop="
                                        () => actionClick('bookmark', item)
                                    "
                                >
                                    <a-tooltip color="#363636"  placement="top">
                                        <template #title>Bookmark</template>

                                        <AtlanIcon
                                            icon="BookmarkOutlined"
                                            :class="
                                                item?.selected
                                                    ? 'tree-light-color'
                                                    : ''
                                            "
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>-->
                            </div>
                        </div>
                        <!------------------------------->
                    </div>
                </a-popover>
            </div>
            <!-- ---------------- -->
            <div class="flex w-full m-0" v-else>
                <div
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
                    <!--For Others -->
                    <div class="parent-ellipsis-container">
                        <AtlanIcon
                            :icon="assetType(item)"
                            class="
                                w-4
                                h-4
                                mr-1.5
                                -mt-0.5
                                parent-ellipsis-container-extension
                            "
                        ></AtlanIcon>

                        <span
                            class="mb-0 text-sm text-gray-700  parent-ellipsis-container-base"
                            >{{ title(item) }}</span
                        >
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
                            class="absolute right-0 flex items-center h-full pr-2 text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                            :class="
                                item?.selected
                                    ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                    : 'bg-gradient-to-l from-gray-light via-gray-light'
                            "
                            @click.stop="() => {}"
                        >
                            <div
                                class="pl-2 ml-24"
                                @click="() => actionClick('add', item)"
                            >
                                <a-tooltip color="#363636" placement="top">
                                    <template #title
                                        >Place name in editor</template
                                    >
                                    <AtlanIcon
                                        icon="AddAssetName"
                                        class="w-4 h-4 my-auto"
                                        :class="
                                            item?.selected
                                                ? 'tree-light-color'
                                                : 'bg-gray-light'
                                        "
                                    ></AtlanIcon>
                                </a-tooltip>
                            </div>
                        </div>
                    </div>
                    <!------------------------------->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ComputedRef,
        computed,
        Ref,
        inject,
        toRaw,
        ref,
        watch,
    } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SchemaTreeItemPopover from '~/components/insights/explorers/schema/schemaItemPopover.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import StatusBadge from '@common/badge/status/index.vue'

    export default defineComponent({
        components: { SchemaTreeItemPopover, StatusBadge },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const editorInstanceRef = inject('editorInstance') as Ref<any>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            const popoverAllowed = ['Column', 'Table']
            const isPopoverAllowed = (typeName: string) => {
                return popoverAllowed.includes(typeName)
            }

            const selectionObject: Ref<any> = ref({
                startLineNumber: 1,
                startColumnNumber: 1,
                endLineNumber: 1,
                endColumnNumber: 1,
            })
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
                certificateStatus,
            } = useAssetInfo()
            const { isSameNodeOpenedInSidebar } = useSchema()
            const { focusEditor, setSelection } = useEditor()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            const { item } = toRefs(props)
            const { queryRun } = useRunQuery()
            const { modifyActiveInlineTabEditor, modifyActiveInlineTab } =
                useInlineTab()
            // callback fxn
            const getData = (dataList, columnList) => {
                if (activeInlineTab && inlineTabs?.value) {
                    const activeInlineTabCopy: activeInlineTabInterface =
                        JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                    activeInlineTabCopy.playground.editor.dataList = dataList

                    activeInlineTabCopy.playground.editor.columnList =
                        columnList
                    const saveQueryDataInLocalStorage = false
                    modifyActiveInlineTabEditor(
                        activeInlineTabCopy,
                        inlineTabs,
                        saveQueryDataInLocalStorage
                    )
                    setSelection(
                        toRaw(editorInstanceRef.value),
                        toRaw(monacoInstanceRef.value),
                        selectionObject.value
                    )
                    focusEditor(toRaw(editorInstanceRef.value))
                }
            }
            // const selectAndFocus=()={

            // }

            const actionClick = (action: string, t: assetInterface) => {
                switch (action) {
                    case 'add': {
                        const editorInstance = toRaw(editorInstanceRef.value)
                        editorInstance.trigger('keyboard', 'type', {
                            text: `${title(t)} `,
                        })
                        break
                    }
                    case 'play': {
                        const activeInlineTabCopy: activeInlineTabInterface =
                            Object.assign({}, activeInlineTab.value)
                        // previous text
                        const prevText =
                            activeInlineTabCopy.playground.editor.text
                        // new text
                        const newQuery = `\/* ${title(
                            item.value
                        )} preview *\/\nSELECT * FROM ${title(
                            item.value
                        )} LIMIT 50;\n`
                        const newText = `${newQuery}${prevText}`
                        activeInlineTabCopy.playground.editor.text = newText
                        modifyActiveInlineTab(
                            activeInlineTabCopy,
                            inlineTabs,
                            activeInlineTabCopy.isSaved
                        )
                        selectionObject.value.startLineNumber = 2
                        selectionObject.value.startColumnNumber = 1
                        selectionObject.value.endLineNumber = 2
                        selectionObject.value.endColumnNumber =
                            newQuery.length + 1 // +1 for semicolon
                        queryRun(activeInlineTab, getData)

                        break
                    }
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
                            openAssetSidebar(activeInlineTabCopy, 'not_editor')
                        }
                        break
                    }
                    case 'bookmark': {
                        break
                    }
                }
            }

            return {
                isPopoverAllowed,
                activeInlineTab,
                certificateStatus,
                isPrimary,
                title,
                assetType,
                dataType,
                dataTypeImage,
                actionClick,
                dataTypeImageForColumn,

                item,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tree-container {
        overflow: hidden;
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
    .popover-width {
        min-width: 440px;
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
    .tree-select-full {
        width: 120%;
    }

    /* ------------------------------- */
</style>
<style lang="less" module>
    :global(.ant-popover-inner-content) {
        // min-width: 440px !important;
        max-width: none !important;
        // min-height: 228px !important;
    }
    :global(.ant-tree li) {
        @apply pt-0 pb-0 !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
