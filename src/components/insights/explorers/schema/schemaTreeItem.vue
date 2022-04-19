<template>
    <div
        :data-test-id="item?.guid"
        class="flex items-center w-full group"
        :style="{ height: assetType(item) == 'Column' ? '32px' : '32px' }"
    >
        <div class="flex justify-between w-full h-full overflow-hidden">
            <!-- Popover Allowed -->
            <div
                class="flex w-full m-0"
                v-if="isPopoverAllowed(item?.typeName) && hoverActions"
            >
                <PopoverAsset
                    :item="item"
                    placement="right"
                    :mouseEnterDelay="1"
                    @previewAsset="() => actionClick('info', item)"
                >
                    <div
                        class="relative flex items-center content-center w-full h-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
                        style=""
                    >
                        <!--For Column-->
                        <div
                            v-if="assetType(item) == 'Column'"
                            class="relative flex items-center justify-between w-full h-8 h-full"
                            style=""
                        >
                            <div class="relative parent-ellipsis-container">
                                <component
                                    :is="dataTypeImage(item)"
                                    class="flex-none w-auto h-4 mr-1 -mt-0.5 text-gray-500"
                                    v-if="dataTypeImage(item)"
                                ></component>
                                <span
                                    v-else
                                    class="flex-none w-auto h-4 mr-1 -mt-0.5 text-gray-500"
                                >
                                    -
                                </span>
                                <span
                                    class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                                    >{{ title(item) }}
                                    <!-- <span> {{ childCount(item) }}</span> -->
                                </span>

                                <StatusBadge
                                    v-if="certificateStatus(item)"
                                    :key="item?.guid"
                                    :show-no-status="false"
                                    :status-id="certificateStatus(item)"
                                    class="ml-1.5 mb-1 parent-ellipsis-container-extension"
                                ></StatusBadge>
                            </div>
                            <div
                                v-if="hoverActions"
                                class="absolute right-0 flex items-center text-gray-500 transition opacity-0 h-7 margin-align-top group-hover:opacity-100"
                                style="width: "
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-tree-light-color via-tree-light-color'
                                "
                                @click.stop="() => {}"
                            >
                                <div
                                    :data-test-id="'insert-in-editor'"
                                    class="pl-2 ml-20"
                                    v-if="!showVQB"
                                    @click="() => actionClick('add', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title
                                            >Place name in editor</template
                                        >
                                        <div
                                            class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                        >
                                            <AtlanIcon
                                                icon="AddAssetName"
                                                class="w-4 h-4 my-auto focus:outline-none"
                                            ></AtlanIcon>
                                        </div>
                                    </a-tooltip>
                                </div>
                                <!-- Add pr-2 for next icon -->
                                <div
                                    :data-test-id="'preview'"
                                    class="pl-2"
                                    @click="() => actionClick('info', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title
                                            >Open preview sidebar</template
                                        >
                                        <div
                                            class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                        >
                                            <AtlanIcon
                                                icon="SidebarSwitch"
                                                class="w-4 h-4 my-auto outline-none"
                                            ></AtlanIcon>
                                        </div>
                                    </a-tooltip>
                                </div>
                                <VQBThreeDotMenuForColumn
                                    v-if="showVQB"
                                    :item="item"
                                    :treeData="treeData"
                                />

                                <!-- <div
                                    class="bg-gray-light-color"
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
                                class="flex items-center text-xs leading-5 text-gray-500"
                            >
                                <!-- <div
                                    class="flex items-center"
                                    v-if="isPrimary(item)"
                                >
                                    <div class="flex items-center mr-2">
                                        <AtlanIcon
                                            icon="PrimaryKey"
                                            class="w-4 h-4 my-auto mr-1 primary-key-color"
                                        ></AtlanIcon>
                                        <span class="primary-key-color"
                                            >Pkey</span
                                        >
                                    </div>
                                </div> -->

                                <ColumnKeys
                                    v-if="
                                        isPrimary(item) ||
                                        isForeign(item) ||
                                        isPartition(item)
                                    "
                                    :isPrimary="isPrimary(item)"
                                    :isForeign="isForeign(item)"
                                    :isPartition="isPartition(item)"
                                />
                                <span v-else>{{ dataType(item) ?? '-' }}</span>
                            </div>
                        </div>
                        <!--For Others: Table Item -->
                        <div v-else class="flex items-center w-full h-8 m-0">
                            <div
                                class="flex items-center justify-between w-full h-8 h-full"
                            >
                                <div
                                    class="flex items-center parent-ellipsis-container"
                                >
                                    <AtlanIcon
                                        :icon="
                                            getEntityStatusIcon(
                                                assetType(item),
                                                certificateStatus(item)
                                            )
                                        "
                                        class="w-4 h-4 mr-1 -mt-0.5 parent-ellipsis-container-extension"
                                    ></AtlanIcon>

                                    <span
                                        class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                                        >{{ title(item) }}
                                    </span>
                                </div>
                                <div>
                                    <span class="z-10 count-box">
                                        {{ childCount(item) }}</span
                                    >
                                </div>
                            </div>

                            <div
                                v-if="hoverActions"
                                class="absolute right-0 flex items-center text-gray-500 transition opacity-0 h-7 margin-align-top group-hover:opacity-100"
                                @click.stop="() => {}"
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-tree-light-color via-tree-light-color'
                                "
                            >
                                <div
                                    :data-test-id="'insert-in-editor'"
                                    class="pl-2 ml-4"
                                    v-if="!showVQB"
                                    @click="() => actionClick('add', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title
                                            >Place name in editor</template
                                        >
                                        <div
                                            class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                        >
                                            <AtlanIcon
                                                icon="AddAssetName"
                                                class="w-4 h-4 my-auto focus:outline-none"
                                            ></AtlanIcon>
                                        </div>
                                    </a-tooltip>
                                </div>

                                <div class="pl-2" v-if="showVQB">
                                    <VQBThreeDotMenuForTable
                                        v-if="showVQB"
                                        :item="item"
                                        :treeData="treeData"
                                    />
                                </div>
                                <div
                                    class="pl-1 pr-1"
                                    :data-test-id="'preview'"
                                    @click="() => actionClick('info', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title
                                            >Open preview sidebar</template
                                        >
                                        <div
                                            class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                        >
                                            <AtlanIcon
                                                icon="SidebarSwitch"
                                                class="w-4 h-4 my-auto outline-none"
                                            ></AtlanIcon>
                                        </div>
                                    </a-tooltip>
                                </div>
                                <div
                                    :data-test-id="'run-table-query'"
                                    v-if="showVQB"
                                    :class="
                                        (activeInlineTab.playground.resultsPane
                                            .result.isQueryRunning === 'loading'
                                            ? 'opacity-50 cursor-not-allowed'
                                            : '',
                                        '')
                                    "
                                    @click="() => previewVQBQuery(item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title>{{
                                            tooltipText
                                        }}</template>
                                        <div
                                            class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                        >
                                            <AtlanIcon
                                                icon="Play"
                                                class="w-4 h-4 my-auto outline-none"
                                            ></AtlanIcon>
                                        </div>
                                    </a-tooltip>
                                </div>

                                <!-- Add pr-2 for next icon -->
                                <div
                                    :data-test-id="'run-table-query'"
                                    v-if="!showVQB"
                                    :class="
                                        activeInlineTab.playground.resultsPane
                                            .result.isQueryRunning === 'loading'
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    "
                                    @click="() => previewData(item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title>{{
                                            tooltipText
                                        }}</template>
                                        <div
                                            class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                        >
                                            <AtlanIcon
                                                icon="Play"
                                                class="w-4 h-4 my-auto outline-none"
                                            ></AtlanIcon>
                                        </div>
                                    </a-tooltip>
                                </div>
                                <!-- <div
                                    class="bg-gray-light-color"
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
                </PopoverAsset>
            </div>

            <!-- FOR DB AND SCHMA -->
            <div
                v-if="!isPopoverAllowed(item?.typeName) && hoverActions"
                class="flex w-full m-0"
            >
                <div
                    class="relative flex items-center content-center w-full h-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <!-- <div class="parent-ellipsis-container"> -->
                    <div
                        class="flex items-center justify-between w-full h-full"
                    >
                        <div
                            class="flex items-center w-11/12 parent-ellipsis-container"
                        >
                            <AtlanIcon
                                :icon="
                                    getEntityStatusIcon(
                                        assetType(item),
                                        certificateStatus(item)
                                    )
                                "
                                class="w-4 h-4 mr-1 -mt-0.5 parent-ellipsis-container-extension"
                            ></AtlanIcon>

                            <span
                                class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                                >{{ title(item) }}
                            </span>
                        </div>

                        <div>
                            <span class="z-10 count-box">
                                {{ childCount(item) }}</span
                            >
                        </div>
                    </div>

                    <div
                        v-if="hoverActions"
                        class="absolute right-0 flex items-center text-gray-500 transition opacity-0 h-7 margin-align-top group-hover:opacity-100"
                        :class="
                            item?.selected
                                ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                : 'bg-gradient-to-l from-tree-light-color via-tree-light-color'
                        "
                        @click.stop="() => {}"
                    >
                        <div class="pl-2 ml-4">
                            <InsightsThreeDotMenu
                                :options="dropdownOptions"
                                :item="item"
                                class="w-4 h-4 my-auto -mr-1.5 outline-none"
                            >
                                <template #menuTrigger>
                                    <AtlanIcon
                                        icon="KebabMenu"
                                        class="w-4 h-4 my-auto -mr-1.5 outline-none"
                                        :class="
                                            item?.selected
                                                ? 'tree-light-color'
                                                : 'bg-gray-light-color'
                                        "
                                    />
                                </template>
                            </InsightsThreeDotMenu>
                        </div>
                    </div>
                </div>
            </div>
            <!--  -->

            <!-- For others component which does not need hoverActions -->
            <div v-if="item?.typeName === 'Column' && !hoverActions">
                <div
                    class="relative flex items-center content-center w-full h-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <div
                        v-if="assetType(item) == 'Column'"
                        class="relative flex items-center justify-between w-full h-full"
                    >
                        <component
                            :is="dataTypeImage(item)"
                            class="flex-none w-auto h-4 mr-1 -mt-0.5 text-gray-500"
                        ></component>
                        <span class="mb-0 text-sm text-gray-700"
                            >{{ title(item) }}
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
                            class="w-4 h-4 mr-1.5 -mt-0.5 parent-ellipsis-container-extension"
                        ></AtlanIcon>

                        <span
                            class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                            >{{ title(item) }}
                            <span class="count-box">
                                {{ childCount(item) }}</span
                            >
                        </span>
                        <div
                            v-if="hoverActions"
                            class="absolute right-0 flex items-center text-gray-500 transition opacity-0 h-7 margin-align-top group-hover:opacity-100"
                            @click.stop="() => {}"
                            :class="
                                item?.selected
                                    ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                    : 'bg-gradient-to-l from-tree-light-color via-tree-light-color'
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
                                    <div
                                        class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                    >
                                        <AtlanIcon
                                            icon="AddAssetName"
                                            class="w-4 h-4 my-auto focus:outline-none"
                                        ></AtlanIcon>
                                    </div>
                                </a-tooltip>
                            </div>
                            <div
                                class="pl-1 pr-1"
                                :data-test-id="'preview'"
                                @click="() => actionClick('info', item)"
                            >
                                <a-tooltip color="#363636" placement="top">
                                    <template #title
                                        >Open preview sidebar</template
                                    >
                                    <div
                                        class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                    >
                                        <AtlanIcon
                                            icon="SidebarSwitch"
                                            class="w-4 h-4 my-auto outline-none"
                                        ></AtlanIcon>
                                    </div>
                                </a-tooltip>
                            </div>
                            <div
                                :data-test-id="'run-table-query'"
                                :class="
                                    activeInlineTab.playground.resultsPane
                                        .result.isQueryRunning === 'loading'
                                        ? 'opacity-50 cursor-not-allowed pointer-events-none'
                                        : ''
                                "
                                @click="() => previewData(item)"
                            >
                                <a-tooltip color="#363636" placement="top">
                                    <template #title>{{
                                        tooltipText
                                    }}</template>
                                    <div
                                        class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                    >
                                        <AtlanIcon
                                            icon="Play"
                                            class="w-4 h-4 my-auto outline-none"
                                        ></AtlanIcon>
                                    </div>
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
                    class="relative flex items-center content-center w-full h-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <div class="parent-ellipsis-container">
                        <AtlanIcon
                            :icon="assetType(item)"
                            class="w-4 h-4 mr-1.5 -mt-0.5 parent-ellipsis-container-extension"
                        ></AtlanIcon>

                        <span
                            class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
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
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import usePreviewQueryRun from '~/components/insights/playground/common/composables/previewQueryRun'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import StatusBadge from '@common/badge/status/index.vue'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import { generateUUID } from '~/utils/helper/generator'
    import { useMapping } from '~/components/insights/playground/editor/common/composables/useMapping'
    // import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import ColumnKeys from '~/components/common/column/columnKeys.vue'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { getDialectInfo } from '~/components/insights/common/composables/getDialectInfo'
    import { useActiveTab } from '~/components/insights/common/composables/useActiveTab'
    import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'
    import { useRunQueryUtils } from '~/components/insights/common/composables/useRunQueryUtils'
    import VQBThreeDotMenuForColumn from '~/components/insights/explorers/schema/VQBThreeDotMenu/column.vue'
    import VQBThreeDotMenuForTable from '~/components/insights/explorers/schema/VQBThreeDotMenu/table.vue'
    import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
    import { generateSQLQuery } from '~/components/insights/playground/editor/vqb/composables/generateSQLQuery'
    import insightsStore from '~/store/insights/index'
    import InsightsThreeDotMenu from '~/components/insights/common/dropdown/index.vue'
    import { MenuItem } from 'ant-design-vue'

    export function getLastMappedKeyword(
        token_param: string[],
        mappingKeywords,
        mappingKeywordsKeys
    ) {
        // console.log(tokens)
        let tokens = token_param.map((token) => token?.toUpperCase())
        for (let i = tokens.length - 1; i >= 0; i--) {
            /* type- TABLE/COLUMN/SQL keyword */
            if (mappingKeywordsKeys.includes(tokens[i])) {
                return {
                    token: tokens[i],
                    index: i,
                    type: mappingKeywords[tokens[i]],
                }
            }
        }
        return undefined
    }

    export default defineComponent({
        components: {
            InsightsThreeDotMenu,
            StatusBadge,
            PopoverAsset,
            AtlanBtn,
            ColumnKeys,
            VQBThreeDotMenuForColumn,
            VQBThreeDotMenuForTable,
        },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            treeData: {
                type: Object as PropType<TreeDataItem[]>,
                required: true,
                default: () => [],
            },
            hoverActions: {
                type: Boolean,
                default: true,
            },
        },
        setup(props) {
            const insights_Store = insightsStore()
            const { hoverActions, treeData } = toRefs(props)
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeResultPreviewTab = inject(
                'activeResultPreviewTab'
            ) as Ref<boolean>
            const editorInstanceRef = inject('editorInstance') as Ref<any>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            const popoverAllowed = ['Column', 'Table', 'View']
            const isPopoverAllowed = (typeName: string) => {
                return popoverAllowed.includes(typeName)
            }

            const editorInstance = inject('editorInstance') as Ref<any>
            const monacoInstance = inject('monacoInstance') as Ref<any>

            const selectionObject: Ref<any> = ref({
                startLineNumber: 1,
                startColumnNumber: 1,
                endLineNumber: 1,
                endColumnNumber: 1,
            })
            const {
                isPrimary,
                isForeign,
                isPartition,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
                certificateStatus,
            } = useAssetInfo()
            const { isSameNodeOpenedInSidebar } = useSchema()
            const { focusEditor, setSelection } = useEditor()
            const { getConnectorName } = useConnector()

            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            const { item } = toRefs(props)
            const { queryRun } = useRunQuery()
            const { previewRun } = usePreviewQueryRun()
            const showVQB = computed(() => {
                return activeInlineTab?.value?.playground?.isVQB
            })

            const limitRows = ref({
                checked: true,
                rowsCount: 100,
            })
            const {
                modifyActiveInlineTabEditor,
                modifyActiveInlineTab,
                inlineTabAdd,
                // activeInlineTabKey,
                setVQBInInlineTab,
            } = useInlineTab()
            // callback fxn
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const getData = (activeInlineTab, dataList, columnList) => {
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
                        false,
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

            const previewData = (item) => {
                if (
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning === 'loading'
                ) {
                    return
                } else {
                    actionClick('play', item)
                }
            }

            const tooltipText = computed(() => {
                if (
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning === 'loading'
                ) {
                    return 'Another query is running'
                } else {
                    return 'Preview data'
                }
            })

            const actionClick = (action: string, t: assetInterface) => {
                // for assetQuote Info of different sources
                const assetQuoteType = getDialectInfo(
                    getConnectorName(
                        activeInlineTab.value.explorer.schema.connectors
                            .attributeValue
                    ) ?? ''
                )
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
                                        text: `${assetQuoteType}${title(
                                            t
                                        )}${assetQuoteType}, `,
                                    }
                                )
                            } else {
                                toRaw(editorInstanceRef.value).trigger(
                                    'keyboard',
                                    'type',
                                    {
                                        text: `${assetQuoteType}${title(
                                            t
                                        )}${assetQuoteType}`,
                                    }
                                )
                            }
                        } else {
                            toRaw(editorInstanceRef.value).trigger(
                                'keyboard',
                                'type',
                                {
                                    text: `${assetQuoteType}${title(
                                        t
                                    )}${assetQuoteType}`,
                                }
                            )
                        }

                        break
                    }
                    case 'play': {
                        const activeInlineTabCopy: activeInlineTabInterface =
                            JSON.parse(
                                JSON.stringify(toRaw(activeInlineTab.value))
                            )

                        let newQuery = `-- ${title(
                            item.value
                        )} preview \nSELECT * FROM ${assetQuoteType}${title(
                            item.value
                        )}${assetQuoteType} LIMIT 50;\n`

                        let databaseName = item.value?.databaseName
                        let schemaName = item.value?.schemaName
                        let tableName = title(item.value)

                        let queryConnectionQualifiedName =
                            item.value.connectionQualifiedName
                        let queryDatabaseQualifiedName =
                            item.value.databaseQualifiedName
                        let querySchemaQualifiedName =
                            item.value.databaseQualifiedName +
                            '/' +
                            item.value.schemaName

                        let updatedEditorSchemaQualifiedName =
                            item.value?.databaseQualifiedName +
                            '/' +
                            item.value?.schemaName

                        // if we have a editor context
                        const prevText =
                            activeInlineTabCopy.playground.editor.text
                        // new text
                        let editorContext =
                            activeInlineTabCopy.explorer.schema.connectors
                        let editorContextType = editorContext?.attributeName
                        let editorContextValue = editorContext?.attributeValue

                        console.log('editorContextType', editorContextType)

                        // 1st missing context in editor:
                        // 2nd context mismatch in editor and query

                        // console.log('run query')

                        switch (editorContextType) {
                            case 'connectionQualifiedName': {
                                // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${databaseName}${assetQuoteType}.${assetQuoteType}${schemaName}${assetQuoteType}.${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                if (
                                    editorContextValue !==
                                    queryConnectionQualifiedName
                                ) {
                                    // openContextModal()
                                    // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                    newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`

                                    playQuery(newQuery, item.value)

                                    return
                                } else {
                                    playQuery(newQuery, item.value)
                                    return
                                }
                                break
                            }
                            case 'databaseQualifiedName': {
                                // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`
                                newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${schemaName}${assetQuoteType}.${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`

                                if (
                                    editorContextValue !==
                                    queryDatabaseQualifiedName
                                ) {
                                    let editorContextValueArray =
                                        editorContextValue?.split('/')
                                    let cqn = editorContextValueArray
                                        ?.slice(0, 3)
                                        .join('/')
                                    let dbqn = editorContextValueArray
                                        ?.slice(0, 4)
                                        .join('/')

                                    if (cqn !== queryConnectionQualifiedName) {
                                        // console.log('cqn: ', {
                                        //     cqn,
                                        //     queryConnectionQualifiedName,
                                        // })
                                        // open in new tab
                                        // openContextModal()
                                        // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                        newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                        playQuery(newQuery, item.value)
                                        return
                                    } else {
                                        if (
                                            dbqn !== queryDatabaseQualifiedName
                                        ) {
                                            const tabIndex =
                                                inlineTabs.value.findIndex(
                                                    (tab) =>
                                                        tab.key ===
                                                        activeInlineTabKey.value
                                                )
                                            // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                            newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${databaseName}${assetQuoteType}.${assetQuoteType}${schemaName}${assetQuoteType}.${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                            playQuery(newQuery, item.value)
                                            return
                                        }
                                    }
                                    // here, check db--->connection
                                } else {
                                    // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`
                                    newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${schemaName}${assetQuoteType}.${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                    playQuery(newQuery, item.value)
                                    return
                                }
                                break
                            }
                            case 'schemaQualifiedName':
                            case 'defaultSchemaQualifiedName': {
                                // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                // console.log(
                                //     'defaultSchemaQualifiedName',
                                //     newQuery
                                // )

                                // console.log('run in schema')
                                if (
                                    editorContextValue !==
                                    querySchemaQualifiedName
                                ) {
                                    let editorContextValueArray =
                                        editorContextValue?.split('/')
                                    let cqn = editorContextValueArray
                                        ?.slice(0, 3)
                                        .join('/')
                                    let dbqn = editorContextValueArray
                                        ?.slice(0, 4)
                                        .join('/')
                                    let sqn = editorContextValueArray
                                        ?.slice(0, 5)
                                        .join('/')

                                    if (cqn !== queryConnectionQualifiedName) {
                                        playQuery(newQuery, item.value)
                                        return
                                    } else {
                                        const tabIndex =
                                            inlineTabs.value.findIndex(
                                                (tab) =>
                                                    tab.key ===
                                                    activeInlineTabKey.value
                                            )
                                        if (
                                            dbqn !== queryDatabaseQualifiedName
                                        ) {
                                            // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                            newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${databaseName}${assetQuoteType}.${assetQuoteType}${schemaName}${assetQuoteType}.${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                            playQuery(newQuery, item.value)
                                            return
                                        } else {
                                            if (
                                                sqn !== querySchemaQualifiedName
                                            ) {
                                                // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`
                                                newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${schemaName}${assetQuoteType}.${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                                playQuery(newQuery, item.value)
                                                return
                                            }
                                        }
                                    }

                                    //here check schema-->db-->connection
                                } else {
                                    console.log('match here')
                                    // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                    newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                    playQuery(newQuery, item.value)
                                    return
                                }
                                break
                            }
                        }

                        break
                    }
                    case 'info': {
                        // i button clicked on the same node -> close the sidebar
                        console.log('info: ', activeInlineTab)
                        if (
                            activeInlineTab?.value &&
                            Object.keys(activeInlineTab?.value).length
                        ) {
                            if (isSameNodeOpenedInSidebar(t, activeInlineTab)) {
                                /* Close it if it is already opened */
                                closeAssetSidebar(activeInlineTab.value)
                            } else {
                                let activeInlineTabCopy: activeInlineTabInterface =
                                    JSON.parse(
                                        JSON.stringify(
                                            toRaw(activeInlineTab.value)
                                        )
                                    )
                                activeInlineTabCopy.assetSidebar.assetInfo =
                                    t.entity
                                activeInlineTabCopy.assetSidebar.isVisible =
                                    true
                                openAssetSidebar(
                                    activeInlineTabCopy,
                                    'not_editor'
                                )
                            }
                        } else {
                            let activeInlineTabCopy: activeInlineTabInterface =
                                JSON.parse(
                                    JSON.stringify(toRaw(activeInlineTab.value))
                                )

                            if (!Object.keys(activeInlineTabCopy).length) {
                                let tableName = title(item.value)
                                // let newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                let newQuery = `-- ${assetQuoteType}${tableName}${assetQuoteType} preview \nSELECT * FROM ${assetQuoteType}${tableName}${assetQuoteType} LIMIT 50;\n`
                                let updatedEditorSchemaQualifiedName =
                                    item.value?.databaseQualifiedName +
                                    '/' +
                                    item.value?.schemaName

                                handleAddNewTab(
                                    newQuery,
                                    {
                                        attributeName: 'schemaQualifiedName',
                                        attributeValue:
                                            updatedEditorSchemaQualifiedName,
                                    },
                                    {
                                        attributeName: 'schemaQualifiedName',
                                        attributeValue:
                                            updatedEditorSchemaQualifiedName,
                                    },
                                    item.value
                                )

                                activeInlineTabCopy = JSON.parse(
                                    JSON.stringify(toRaw(activeInlineTab.value))
                                )
                                // playQuery(newQuery, newQuery, activeInlineTabCopy)
                            }
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

            const playQuery = (newQuery, asset: assetInterface) => {
                if (
                    insights_Store.previewTabs.findIndex(
                        (el) => el.asset.guid === asset.guid
                    ) > -1
                ) {
                    insights_Store.activePreviewGuid = asset.guid
                    return
                }
                activeResultPreviewTab.value = false
                insights_Store.addPreviewTab(asset)
                insights_Store.activePreviewGuid = asset.guid
                // schema explorer context
                const attributeValue =
                    activeInlineTab.value.explorer.schema.connectors
                        ?.attributeValue
                const tabIndex = inlineTabs.value.findIndex(
                    (tab) => tab.key === activeInlineTabKey.value
                )

                previewRun({
                    previewTabIndex: 0,
                    tabsArray: inlineTabs,
                    queryText: newQuery,
                    attributeValue,
                    tabIndex,
                    getData: insights_Store.getData,
                    limitRows,
                    inlineTabs,
                })
            }

            let childCount = (item) => {
                if (assetType(item) === 'Database') {
                    return item?.attributes?.schemaCount !== undefined
                        ? item.attributes.schemaCount
                        : '-'
                } else if (assetType(item) === 'Schema') {
                    return (
                        // item?.attributes?.tableCount ??
                        // 0 + item?.attributes?.viewCount ??
                        // 0

                        item?.attributes?.tableCount
                            ? item?.attributes?.tableCount
                            : '-'
                    )
                } else if (
                    assetType(item) === 'Table' ||
                    assetType(item) === 'View'
                ) {
                    return item?.attributes?.columnCount
                        ? item.attributes.columnCount
                        : '-'
                }
            }

            const openSidebar = () => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                activeInlineTabCopy.assetSidebar.assetInfo = item.value
                activeInlineTabCopy.assetSidebar.isVisible = true
                openAssetSidebar(activeInlineTabCopy, 'not_editor')
            }

            // let showContextModal = ref(false)
            // const closeContextModal = () => {
            //     showContextModal.value = false
            // }
            // const openContextModal = () => {
            //     showContextModal.value = true
            // }
            // let selectedOption = ref(null)
            // const openInCurrentTab = () => {
            //     selectedOption.value = 'current'
            // }

            // const openInNewTab = () => {
            //     selectedOption.value = 'new'
            // }
            // const router = useRouter()
            // const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>

            const handleAddNewTab = (
                query,
                context,
                explorerContext,
                previewItem
            ) => {
                const { generateNewActiveTab } = useActiveTab()

                const inlineTabData = generateNewActiveTab({
                    activeInlineTab,
                    label: `${previewItem.title} preview`,
                    editorText: query,
                    context,
                    schemaConnectors: explorerContext,
                    queryConnectors: {
                        connector:
                            previewItem.connectionQualifiedName.split('/')[1],
                    },
                })

                inlineTabAdd(inlineTabData, tabs, activeInlineTabKey)
                return inlineTabData.key
            }

            const setContextInEditor = (item) => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))

                let qualifiedName = item?.qualifiedName?.split('/')
                if (qualifiedName?.length === 5) {
                    activeInlineTabCopy.playground.editor.context = {
                        attributeName: 'schemaQualifiedName',
                        attributeValue: item?.qualifiedName,
                    }
                } else if (qualifiedName?.length === 4) {
                    activeInlineTabCopy.playground.editor.context = {
                        attributeName: 'databaseQualifiedName',
                        attributeValue: item?.qualifiedName,
                    }
                }

                setVQBInInlineTab(activeInlineTabCopy, inlineTabs)
            }

            const isQueryCreatedByCurrentUser = inject(
                'isQueryCreatedByCurrentUser'
            ) as ComputedRef
            const hasQueryReadPermission = inject(
                'hasQueryReadPermission'
            ) as ComputedRef
            const hasQueryWritePermission = inject(
                'hasQueryWritePermission'
            ) as ComputedRef

            const readOnly = computed(() =>
                activeInlineTab?.value?.qualifiedName?.length === 0
                    ? false
                    : isQueryCreatedByCurrentUser.value
                    ? false
                    : hasQueryWritePermission.value
                    ? false
                    : true
            )

            const previewVQBQuery = (item: any) => {
                const activeInlineTabCopy = JSON.parse(
                    JSON.stringify(toRaw(activeInlineTab.value))
                )
                activeInlineTabCopy.playground.vqb.panels = []
                let panel = {
                    order: 1,
                    id: 'columns',
                    hide: true,
                    subpanels: [
                        {
                            id: '1',
                            columns: ['all'],
                            tableData: {
                                assetType: item?.entity.typeName,
                                certificateStatus:
                                    item?.entity?.attributes?.certificateStatus,
                                item: {},
                            },
                            columnsData: [],
                            tableQualfiedName:
                                item?.entity.attributes?.qualifiedName,
                        },
                    ],
                    expand: false,
                }

                activeInlineTabCopy.playground.vqb.panels = [panel]
                activeInlineTabCopy.playground.vqb.selectedTables = [
                    {
                        addedBy: 'column',
                        tableQualifiedName:
                            item?.entity.attributes?.qualifiedName,
                    },
                ]

                const useSchemaExplorerContext = true

                const selectedText = generateSQLQuery(
                    activeInlineTabCopy,
                    limitRows.value,
                    useSchemaExplorerContext
                )

                activeResultPreviewTab.value = false
                insights_Store.addPreviewTab(item?.entity)
                insights_Store.activePreviewGuid = item?.entity?.guid
                // schema explorer context
                const attributeValue =
                    activeInlineTab.value.explorer.schema.connectors
                        ?.attributeValue
                const tabIndex = inlineTabs.value.findIndex(
                    (tab) => tab.key === activeInlineTabKey.value
                )

                previewRun({
                    previewTabIndex: insights_Store.previewTabs.length - 1,
                    tabsArray: inlineTabs,
                    queryText: selectedText,
                    attributeValue,
                    tabIndex,
                    getData: insights_Store.getData,
                    limitRows,
                    inlineTabs,
                })
            }

            const dropdownOptions = [
                {
                    title: 'Set in editor context',
                    key: 'Set in editor context',
                    class: `
                                                ${
                                                    readOnly.value
                                                        ? ' bg-gray-100 cursor-not-allowed pointer-events-none'
                                                        : 'cursor-pointer'
                                                }
                                                    
                                            `,
                    disabled: false,
                    icon: 'Add',
                    iconClass: 'w-4 h-4 my-auto mr-1.5',
                    wrapperClass: 'flex items-center ',
                    component: MenuItem,
                    handleClick: ({ item }) => {
                        setContextInEditor(item)
                    },
                },
                {
                    title: 'Place name in editor',
                    key: 'AddAssetName',
                    component: MenuItem,
                    icon: 'AddAssetName',
                    iconClass: 'w-4 h-4 my-auto mr-1.5 focus:outline-none',
                    wrapperClass: 'flex items-center ',
                    class: '',
                    hide: showVQB.value,
                    disabled: false,
                    handleClick: ({ item }) => {
                        actionClick('add', item)
                    },
                },
            ]

            return {
                dropdownOptions,
                // showContextModal,
                // closeContextModal,
                // openInCurrentTab,
                // openInNewTab,
                treeData,
                showVQB,
                hoverActions,
                isPopoverAllowed,
                activeInlineTab,
                certificateStatus,
                isPrimary,
                isForeign,
                isPartition,
                title,
                assetType,
                dataType,
                dataTypeImage,
                actionClick,
                dataTypeImageForColumn,
                getEntityStatusIcon,
                item,
                childCount,
                openSidebar,
                setContextInEditor,
                readOnly,
                previewData,
                tooltipText,
                previewVQBQuery,
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
        // margin-top: -1px;
    }
    .primary-key-color {
        color: #3ca5bc;
    }
    /* Tree selection actions bg change */
    .tree-light-color {
        // background-color: #dbe9fe;
        @apply bg-new-gray-300;
    }
    .via-tree-light-color {
        // --tw-gradient-stops: var(--tw-gradient-from), #dbe9fe,
        --tw-gradient-stops: var(--tw-gradient-from), #eff1f5,
            var(--tw-gradient-to, rgba(244, 246, 253, 0)) !important;
    }
    .from-tree-light-color {
        // --tw-gradient-from: #dbe9fe !important;
        --tw-gradient-from: #eff1f5 !important;
    }
    .from-gray-light-color {
        --tw-gradient-from: #f8f8f8;
        --tw-gradient-stops: var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(248, 248, 248, 0));
    }

    .bg-gray-light-color {
        --tw-bg-opacity: 1;
        // background-color: rgba(248, 248, 248, var(--tw-bg-opacity));
        @apply bg-new-gray-200;
    }
    .via-gray-light-color {
        --tw-gradient-stops: var(--tw-gradient-from), #f8f8f8,
            var(--tw-gradient-to, rgba(248, 248, 248, 0));
    }
    .tree-select-full {
        width: 120%;
    }

    .count-box {
        justify-content: center;
        align-items: center;
        display: inline-flex;
        min-width: 18px;
        height: 18px;
        font-weight: 400;
        font-size: 12px;

        line-height: 16px;
        @apply text-gray-500;
    }

    /* ------------------------------- */
</style>
<style lang="less" module>
    :global(.ant-popover-inner-content) {
        // min-width: 440px !important;
        max-width: none !important;
        // min-height: 228px !important;
    }
    .input {
        :global(.ant-input:focus
                .ant-input:hover
                .ant-input::selection
                .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 bg-blue-600 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none border-0 px-0 !important;
        }
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
