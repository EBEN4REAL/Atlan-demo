<template>
    <div
        :data-test-id="item?.guid"
        class="flex items-center w-full group"
        :style="{ height: assetType(item) == 'Column' ? '34px' : '32px' }"
    >
        <div class="flex justify-between w-full overflow-hidden">
            <!-- Popover Allowed -->
            <div
                class="flex w-full m-0"
                v-if="isPopoverAllowed(item?.typeName) && hoverActions"
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
                            class="relative flex items-center justify-between w-full "
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
                                    >{{ title(item) }}
                                    <!-- <span> {{ childCount(item) }}</span> -->
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
                            </div>
                            <div
                                v-if="hoverActions"
                                class="absolute right-0 flex items-center h-full pr-2 text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light via-gray-light'
                                "
                                @click.stop="() => {}"
                            >
                                <div
                                    :data-test-id="'insert-in-editor'"
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
                                    :data-test-id="'preview'"
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
                                :icon="
                                    getEntityStatusIcon(
                                        assetType(item),
                                        certificateStatus(item)
                                    )
                                "
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
                                >{{ title(item) }}
                                <span class="count-box">
                                    {{ childCount(item) }}</span
                                >
                            </span>

                            <div
                                v-if="hoverActions"
                                class="absolute right-0 flex items-center h-full pr-2 text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                                @click.stop="() => {}"
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light via-gray-light'
                                "
                            >
                                <div
                                    :data-test-id="'insert-in-editor'"
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
                                    :data-test-id="'preview'"
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
                                    :data-test-id="'run-table-query'"
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

            <!-- FOR DB AND SCHMA -->
            <div
                v-if="!isPopoverAllowed(item?.typeName) && hoverActions"
                class="flex w-full m-0"
            >
                <div
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
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
                            >{{ title(item) }}
                            <span class="count-box">
                                {{ childCount(item) }}</span
                            >
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
                            v-if="hoverActions"
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
                </div>
            </div>
            <!--  -->

            <!-- For others component which does not need hoverActions -->
            <div v-if="item?.typeName === 'Column' && !hoverActions">
                <div
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
                    <div
                        v-if="assetType(item) == 'Column'"
                        class="relative flex items-center justify-between w-full "
                    >
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
                        <span class="mb-0 text-sm text-gray-700"
                            >{{ title(item)
                            }}<span class="count-box">
                                {{ childCount(item) }}</span
                            >
                        </span>
                        <StatusBadge
                            v-if="certificateStatus(item)"
                            :key="item?.guid"
                            :show-no-status="false"
                            :status-id="certificateStatus(item)"
                            class="ml-1.5 mb-1"
                        ></StatusBadge>
                    </div>
                    <div v-else class="parent-ellipsis-container">
                        <AtlanIcon
                            :icon="
                                getEntityStatusIcon(
                                    assetType(item),
                                    certificateStatus(item)
                                )
                            "
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
                            >{{ title(item) }}
                            <span class="count-box">
                                {{ childCount(item) }}</span
                            >
                        </span>
                        <div
                            v-if="hoverActions"
                            class="absolute right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                            @click.stop="() => {}"
                            :class="
                                item?.selected
                                    ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                    : 'bg-gradient-to-l from-gray-light via-gray-light'
                            "
                        >
                            <div
                                :data-test-id="'insert-in-editor'"
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
                                :data-test-id="'preview'"
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
                            <div
                                :data-test-id="'run-table-query'"
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
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="item?.typeName !== 'Column' && !hoverActions"
                class="flex w-full m-0"
            >
                <div
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
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
                            >{{ title(item) }}
                            <!-- <span class="count-box">
                                ({{ childCount(item) }})</span
                            > -->
                        </span>
                    </div>
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
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SchemaTreeItemPopover from '~/components/insights/explorers/schema/schemaItemPopover.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import StatusBadge from '@common/badge/status/index.vue'
    import { getLastMappedKeyword } from '~/components/insights/playground/editor/common/composables/useAutoSuggestions'

    import {
        useMapping,
        nextKeywords,
    } from '~/components/insights/playground/editor/common/composables/useMapping'
    // import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'

    export default defineComponent({
        components: { SchemaTreeItemPopover, StatusBadge },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            hoverActions: {
                type: Boolean,
                default: true,
            },
        },
        setup(props) {
            const { hoverActions } = toRefs(props)
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const editorInstanceRef = inject('editorInstance') as Ref<any>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            const popoverAllowed = ['Column', 'Table', 'View']
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

            const isLastWordIsSELECT = () => {
                const { mappingKeywordsKeys, mappingKeywords } = useMapping()
                const editorText: string = toRaw(
                    editorInstanceRef.value
                )?.getValue()
                const pos = toRaw(editorInstanceRef.value).getPosition()
                const textTillChangedIndex = toRaw(editorInstanceRef.value)
                    ?.getModel()
                    .getOffsetAt({
                        lineNumber: pos.lineNumber,
                        column: pos.column,
                    })
                const editorTextTillCursorPos = editorText.slice(
                    0,
                    textTillChangedIndex + 1
                )
                let tokens = editorTextTillCursorPos.split(/[ ,\n;"')(]+/gm)
                tokens = tokens.filter((token) => {
                    let t = true
                    t =
                        !token.match(/[-[\]{};/\n()*+?'."\\/^$|#\s\t]/g) &&
                        token !== ''
                    return t
                })
                const lastMatchedKeyword:
                    | undefined
                    | { token: string; index: number; type: string } =
                    getLastMappedKeyword(
                        tokens,
                        mappingKeywords,
                        mappingKeywordsKeys
                    )
                return lastMatchedKeyword
            }

            const actionClick = (action: string, t: assetInterface) => {
                switch (action) {
                    case 'add': {
                        /* If typename is column then add a comma with insertion */
                        if (t.typeName === 'Column') {
                            const lastMatchedKeyword = isLastWordIsSELECT()
                            if (
                                lastMatchedKeyword &&
                                lastMatchedKeyword.token === 'SELECT'
                            ) {
                                toRaw(editorInstanceRef.value).trigger(
                                    'keyboard',
                                    'type',
                                    {
                                        text: `"${title(t)}", `,
                                    }
                                )
                            } else {
                                toRaw(editorInstanceRef.value).trigger(
                                    'keyboard',
                                    'type',
                                    {
                                        text: `"${title(t)}"`,
                                    }
                                )
                            }
                        } else {
                            toRaw(editorInstanceRef.value).trigger(
                                'keyboard',
                                'type',
                                {
                                    text: `"${title(t)}"`,
                                }
                            )
                        }

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
                        )} preview *\/\nSELECT * FROM \"${title(
                            item.value
                        )}\" LIMIT 50;\n`

                        // console.log('selected query: ', item.value)

                        let schemaQualifiedName =
                            item.value?.databaseQualifiedName +
                            '/' +
                            item.value?.schemaName

                        const newText = `${newQuery}${prevText}`
                        activeInlineTabCopy.playground.editor.text = newText
                        /* Setting the current connectors context to editor context so that it can be run */
                        // activeInlineTabCopy.playground.editor.context =
                        //     activeInlineTabCopy.explorer.schema.connectors

                        // setting the editor context based on query even if we don't have a schema or database selected in explorer
                        activeInlineTabCopy.playground.editor.context = {
                            attributeName: 'schemaQualifiedName',
                            attributeValue: schemaQualifiedName,
                        }

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
                            activeInlineTabCopy.assetSidebar.assetInfo =
                                t.entity
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

            let childCount = (item) => {
                if (assetType(item) === 'Database') {
                    return item.attributes.schemaCount
                } else if (assetType(item) === 'Schema') {
                    return (
                        item.attributes.tableCount ??
                        0 + item.attributes.viewCount ??
                        0
                    )
                } else if (
                    assetType(item) === 'Table' ||
                    assetType(item) === 'View'
                ) {
                    return item.attributes.columnCount
                }
            }

            // watch(item, () => {
            //     console.log('schema tree item: ', item.value)
            // })

            return {
                hoverActions,
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
                getEntityStatusIcon,
                item,
                childCount,
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

    .count-box {
        justify-content: center;
        align-items: center;
        // padding: 4px;
        margin: 4px;
        display: inline-flex;
        width: 18px;
        height: 18px;

        /* Blues/primary-light */

        background: #f4f6fd;
        border-radius: 4px;

        font-family: Avenir LT Pro;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        // line-height: 16px;
        /* identical to box height, or 133% */

        /* Blues/primary */

        color: #5277d7;
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
