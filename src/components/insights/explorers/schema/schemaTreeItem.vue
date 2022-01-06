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
                <PopoverAsset :item="item" placement="right">
                    <template #button>
                        <!-- <a-button
                            class="mt-3"
                            @click="actionClick('info', item)"
                            block
                        >
                            <div class="flex justify-center w-full">
                                <div class="flex items-center cursor-pointer">
                                    Open preview sidebar
                                </div>
                            </div>
                        </a-button> -->
                        <AtlanBtn
                            class="flex-none px-0"
                            size="sm"
                            color="minimal"
                            padding="compact"
                            style="height: fit-content"
                            @click="actionClick('info', item)"
                        >
                            <span class="text-primary whitespace-nowrap">
                                Show Preview</span
                            >
                            <AtlanIcon icon="ArrowRight" class="text-primary" />
                        </AtlanBtn>
                    </template>
                    <div
                        class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
                        style="height: 34px !important"
                    >
                        <!--For Column-->
                        <div
                            v-if="assetType(item) == 'Column'"
                            class="relative flex items-center justify-between w-full"
                            style="height: 34px !important"
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
                                class="absolute right-0 flex items-center h-full pr-2 text-gray-500 transition duration-300 opacity-0 margin-align-top group-hover:opacity-100"
                                style="width: "
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light-color via-gray-light-color'
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
                                                    : 'bg-gray-light-color'
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
                                            : 'bg-gray-light-color'
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
                                <div
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
                                </div>
                                <span>{{ dataType(item) ?? '-' }}</span>
                            </div>
                        </div>
                        <!--For Others: Table Item -->
                        <div v-else class="flex w-full h-8 m-0">
                            <div
                                class="flex items-center justify-between w-full h-8"
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
                                class="absolute right-0 flex items-center h-full pr-2 text-gray-500 transition duration-300 opacity-0 margin-align-top group-hover:opacity-100"
                                @click.stop="() => {}"
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light-color via-gray-light-color'
                                "
                            >
                                <div
                                    :data-test-id="'insert-in-editor'"
                                    class="pl-2 ml-4"
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
                                                    : 'bg-gray-light-color'
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
                                            : 'bg-gray-light-color'
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
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <!-- <div class="parent-ellipsis-container"> -->
                    <div class="flex items-center justify-between w-full">
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
                        class="absolute right-0 flex items-center h-full pr-2 text-gray-500 transition duration-300 opacity-0 margin-align-top group-hover:opacity-100"
                        :class="
                            item?.selected
                                ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                : 'bg-gradient-to-l from-gray-light-color via-gray-light-color'
                        "
                        @click.stop="() => {}"
                    >
                        <div class="pl-2 ml-4">
                            <a-dropdown :trigger="['click']">
                                <AtlanIcon
                                    icon="KebabMenu"
                                    class="w-4 h-4 my-auto -mr-1.5 outline-none"
                                    :class="
                                        item?.selected
                                            ? 'tree-light-color'
                                            : 'bg-gray-light-color'
                                    "
                                />
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item
                                            @click="setContextInEditor(item)"
                                            :class="
                                                readOnly
                                                    ? ' bg-gray-100 cursor-not-allowed pointer-events-none'
                                                    : ''
                                            "
                                        >
                                            <div class="flex items-center h-8">
                                                <AtlanIcon
                                                    icon="Add"
                                                    class="w-4 h-4 my-auto mr-1.5"
                                                ></AtlanIcon>
                                                <span
                                                    >Set in editor context</span
                                                >
                                            </div>
                                        </a-menu-item>
                                        <a-menu-item
                                            @click="
                                                () => actionClick('add', item)
                                            "
                                        >
                                            <div class="flex items-center h-8">
                                                <AtlanIcon
                                                    icon="AddAssetName"
                                                    class="w-4 h-4 my-auto mr-1.5"
                                                ></AtlanIcon>
                                                <span
                                                    >Place name in editor</span
                                                >
                                            </div>
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                    </div>
                    <!-- </div> -->
                </div>
            </div>
            <!--  -->

            <!-- For others component which does not need hoverActions -->
            <div v-if="item?.typeName === 'Column' && !hoverActions">
                <div
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <div
                        v-if="assetType(item) == 'Column'"
                        class="relative flex items-center justify-between w-full"
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
                            class="absolute right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0 margin-align-top group-hover:opacity-100"
                            @click.stop="() => {}"
                            :class="
                                item?.selected
                                    ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                    : 'bg-gradient-to-l from-gray-light-color via-gray-light-color'
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
                                                : 'bg-gray-light-color'
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
                                        : 'bg-gray-light-color'
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
                    class="relative flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700"
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

    <!-- <template>
        <a-modal
            :visible="showContextModal"
            :closable="false"
            :class="$style.input"
            :footer="null"
            width="450px"
        >
            <div class="w-full p-4 text-gray-500 bg-white rounded">
                <div class="w-full">
                    <div>
                        Current Tab connection context doesn't match your
                        preview table connection context. Previewing in same tab
                        will rewrite the context.
                    </div>

                    <div
                        class="flex items-center justify-between text-gray-700cursor-pointer"
                    >
                        <AtlanBtn
                            size="sm"
                            color="secondary"
                            padding="compact"
                            class="flex items-center justify-between h-4 p-0 py-1 border-none hover:text-primary"
                            @click="closeContextModal"
                        >
                            <span>Cancel</span>
                        </AtlanBtn>

                        <div class="flex items-center">
                            <AtlanBtn
                                size="sm"
                                color="secondary"
                                padding="compact"
                                class="flex items-center justify-between h-6 p-0 py-1 ml-2 border-none "
                                @click="openInCurrentTab"
                            >
                                <div
                                    class="flex items-center rounded text-primary"
                                >
                                    <span>Open in current tab</span>
                                </div>
                            </AtlanBtn>
                            <AtlanBtn
                                size="sm"
                                color="secondary"
                                padding="compact"
                                class="flex items-center justify-between h-6 p-0 py-1 ml-2 border-none "
                                @click="openInNewTab"
                            >
                                <div
                                    class="flex items-center rounded text-primary"
                                >
                                    <span>Open in new tab</span>
                                </div>
                            </AtlanBtn>
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>
    </template> -->
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
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import StatusBadge from '@common/badge/status/index.vue'
    import { getLastMappedKeyword } from '~/components/insights/playground/editor/common/composables/useAutoSuggestions'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import AtlanBtn from '@/UI/button.vue'
    import { useRouter } from 'vue-router'
    import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'
    import { generateUUID } from '~/utils/helper/generator'
    import {
        useMapping,
        nextKeywords,
    } from '~/components/insights/playground/editor/common/composables/useMapping'
    // import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'

    export default defineComponent({
        components: { StatusBadge, PopoverAsset, AtlanBtn },
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

                        console.log(
                            'activeInlineTab: ',
                            Object.keys(activeInlineTabCopy)
                        )

                        // new logic for preview ctc
                        // previous text

                        // let newQuery = `\/* ${title(
                        //     item.value
                        // )} preview *\/\nSELECT * FROM \"${title(
                        //     item.value
                        // )}\" LIMIT 50;\n`

                        let newQuery = `-- ${title(
                            item.value
                        )} preview \nSELECT * FROM \"${title(
                            item.value
                        )}\" LIMIT 50;\n`

                        // console.log('selected query: ', item.value)

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

                        if (!Object.keys(activeInlineTabCopy).length) {
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
                            let activeInlineTabCopy: activeInlineTabInterface =
                                Object.assign({}, activeInlineTab.value)
                            playQuery(newQuery, newQuery, activeInlineTabCopy)
                            return
                        }

                        // if we have a editor context
                        const prevText =
                            activeInlineTabCopy.playground.editor.text
                        // new text
                        let editorContext =
                            activeInlineTabCopy.playground.editor.context
                        let editorContextType = editorContext?.attributeName
                        let editorContextValue = editorContext?.attributeValue

                        console.log('editorContextType', editorContextType)

                        // 1st missing context in editor:
                        // 2nd context mismatch in editor and query

                        // console.log('run query')

                        switch (editorContextType) {
                            case 'connectionQualifiedName': {
                                // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                newQuery = `-- ${tableName} preview \nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                if (
                                    editorContextValue !==
                                    queryConnectionQualifiedName
                                ) {
                                    // openContextModal()
                                    // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                    newQuery = `-- ${tableName} preview \nSELECT * FROM ${tableName} LIMIT 50;\n`
                                    let newText = `${newQuery}`
                                    handleAddNewTab(
                                        newText,
                                        {
                                            attributeName:
                                                'schemaQualifiedName',
                                            attributeValue:
                                                updatedEditorSchemaQualifiedName,
                                        },
                                        {
                                            ...activeInlineTab.value.explorer
                                                .schema.connectors,
                                        },
                                        item.value
                                    )
                                    let activeInlineTabCopy: activeInlineTabInterface =
                                        Object.assign({}, activeInlineTab.value)
                                    playQuery(
                                        newQuery,
                                        newText,
                                        activeInlineTabCopy
                                    )

                                    return
                                } else {
                                    const newText = `${newQuery}${prevText}`
                                    playQuery(
                                        newQuery,
                                        newText,
                                        activeInlineTabCopy
                                    )
                                    return
                                }
                                break
                            }
                            case 'databaseQualifiedName': {
                                // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`
                                newQuery = `-- ${tableName} preview \nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`

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
                                        newQuery = `-- ${tableName} preview \nSELECT * FROM ${tableName} LIMIT 50;\n`
                                        let newText = `${newQuery}`
                                        handleAddNewTab(
                                            newText,
                                            {
                                                attributeName:
                                                    'schemaQualifiedName',
                                                attributeValue:
                                                    updatedEditorSchemaQualifiedName,
                                            },
                                            {
                                                ...activeInlineTab.value
                                                    .explorer.schema.connectors,
                                            },
                                            item.value
                                        )
                                        let activeInlineTabCopy: activeInlineTabInterface =
                                            Object.assign(
                                                {},
                                                activeInlineTab.value
                                            )
                                        playQuery(
                                            newQuery,
                                            newText,
                                            activeInlineTabCopy
                                        )
                                        return
                                    } else {
                                        if (
                                            dbqn !== queryDatabaseQualifiedName
                                        ) {
                                            // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                            newQuery = `-- ${tableName} preview \nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                            const newText = `${newQuery}${prevText}`
                                            playQuery(
                                                newQuery,
                                                newText,
                                                activeInlineTabCopy
                                            )
                                            return
                                        }
                                    }
                                    // here, check db--->connection
                                } else {
                                    // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`
                                    newQuery = `-- ${tableName} preview \nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`
                                    const newText = `${newQuery}${prevText}`
                                    playQuery(
                                        newQuery,
                                        newText,
                                        activeInlineTabCopy
                                    )
                                    return
                                }
                                break
                            }
                            case 'schemaQualifiedName':
                            case 'defaultSchemaQualifiedName': {
                                // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                newQuery = `-- ${tableName} preview \nSELECT * FROM ${tableName} LIMIT 50;\n`
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
                                        // open in new tab
                                        // openContextModal()
                                        let newText = `${newQuery}`
                                        handleAddNewTab(
                                            newText,
                                            {
                                                attributeName:
                                                    'schemaQualifiedName',
                                                attributeValue:
                                                    updatedEditorSchemaQualifiedName,
                                            },
                                            {
                                                ...activeInlineTab.value
                                                    .explorer.schema.connectors,
                                            },
                                            item.value
                                        )
                                        let activeInlineTabCopy: activeInlineTabInterface =
                                            Object.assign(
                                                {},
                                                activeInlineTab.value
                                            )
                                        playQuery(
                                            newQuery,
                                            newText,
                                            activeInlineTabCopy
                                        )
                                        return
                                    } else {
                                        if (
                                            dbqn !== queryDatabaseQualifiedName
                                        ) {
                                            // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                            newQuery = `-- ${tableName} preview \nSELECT * FROM ${databaseName}.${schemaName}.${tableName} LIMIT 50;\n`
                                            const newText = `${newQuery}${prevText}`
                                            playQuery(
                                                newQuery,
                                                newText,
                                                activeInlineTabCopy
                                            )
                                            return
                                        } else {
                                            if (
                                                sqn !== querySchemaQualifiedName
                                            ) {
                                                // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`
                                                newQuery = `-- ${tableName} preview \nSELECT * FROM ${schemaName}.${tableName} LIMIT 50;\n`
                                                const newText = `${newQuery}${prevText}`
                                                playQuery(
                                                    newQuery,
                                                    newText,
                                                    activeInlineTabCopy
                                                )
                                                return
                                            }
                                        }
                                    }

                                    //here check schema-->db-->connection
                                } else {
                                    console.log('match here')
                                    // newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                    newQuery = `-- ${tableName} preview \nSELECT * FROM ${tableName} LIMIT 50;\n`
                                    const newText = `${newQuery}${prevText}`
                                    playQuery(
                                        newQuery,
                                        newText,
                                        activeInlineTabCopy
                                    )
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
                                    Object.assign({}, activeInlineTab.value)
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
                                Object.assign({}, activeInlineTab.value)

                            if (!Object.keys(activeInlineTabCopy).length) {
                                let tableName = title(item.value)
                                // let newQuery = `\/* ${tableName} preview *\/\nSELECT * FROM ${tableName} LIMIT 50;\n`
                                let newQuery = `-- ${tableName} preview \nSELECT * FROM ${tableName} LIMIT 50;\n`
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

                                activeInlineTabCopy = Object.assign(
                                    {},
                                    activeInlineTab.value
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

            const playQuery = (newQuery, newText, activeInlineTabCopy) => {
                activeInlineTabCopy.playground.editor.text = newText

                modifyActiveInlineTab(
                    activeInlineTabCopy,
                    inlineTabs,
                    activeInlineTabCopy.isSaved
                )

                selectionObject.value.startLineNumber = 2
                selectionObject.value.startColumnNumber = 1
                selectionObject.value.endLineNumber = 2
                selectionObject.value.endColumnNumber = newQuery.length + 1 // +1 for semicolon
                setSelection(
                    toRaw(editorInstanceRef.value),
                    toRaw(monacoInstanceRef.value),
                    selectionObject.value
                )
                queryRun(
                    activeInlineTab,
                    getData,
                    limitRows,
                    null,
                    null,
                    newText,
                    editorInstance,
                    monacoInstance
                )
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
                    Object.assign({}, activeInlineTab.value)
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
            const tabs = inject('inlineTabs')

            const handleAddNewTab = async (
                query,
                context,
                explorerContext,
                previewItem
            ) => {
                const key = generateUUID()
                const inlineTabData: activeInlineTabInterface = {
                    label: `${previewItem.title} preview`,
                    key,
                    favico: 'https://atlan.com/favicon.ico',
                    isSaved: false,
                    queryId: undefined,
                    status: 'is_null',
                    connectionId: '',
                    description: '',
                    qualifiedName: '',
                    parentGuid: '',
                    parentQualifiedName: '',
                    isSQLSnippet: false,
                    savedQueryParentFolderTitle: undefined,
                    explorer: {
                        schema: {
                            connectors: {
                                ...explorerContext,
                            },
                        },
                        queries: {
                            connectors: {
                                connector:
                                    previewItem.connectionQualifiedName.split(
                                        '/'
                                    )[1],
                            },
                            collection: {
                                // copy from last tab
                                guid: activeInlineTab.value?.explorer?.queries
                                    ?.collection?.guid,
                                qualifiedName:
                                    activeInlineTab.value?.explorer?.queries
                                        ?.collection?.qualifiedName,
                                parentQualifiedName:
                                    activeInlineTab.value?.explorer?.queries
                                        ?.collection?.guid,
                            },
                        },
                    },
                    playground: {
                        vqb: {
                            panels: [
                                {
                                    order: 1,
                                    id: 'columns',
                                    hide: true,
                                    subpanels: [
                                        {
                                            id: '1',
                                            tableQualifiedName: undefined,
                                            columns: ['all'],
                                            tableData: {
                                                certificateStatus: undefined,
                                                assetType: undefined,
                                            },
                                            columnsData: [],
                                        },
                                    ],
                                },
                            ],
                        },
                        editor: {
                            context: {
                                ...context,
                            },
                            text: query,
                            dataList: [],
                            columnList: [],
                            variables: [],
                            savedVariables: [],
                            limitRows: {
                                checked: false,
                                rowsCount: -1,
                            },
                        },
                        resultsPane: {
                            activeTab:
                                activeInlineTab.value?.playground?.resultsPane
                                    ?.activeTab ?? 0,
                            result: {
                                title: `${key} Result`,
                                runQueryId: undefined,
                                isQueryRunning: '',
                                queryErrorObj: {},
                                totalRowsCount: -1,
                                executionTime: -1,
                                errorDecorations: [],
                                eventSourceInstance: undefined,
                                buttonDisable: false,
                                isQueryAborted: false,
                            },
                            metadata: {},
                            queries: {},
                            joins: {},
                            filters: {},
                            impersonation: {},
                            downstream: {},
                            sqlHelp: {},
                        },
                    },
                    assetSidebar: {
                        // for taking the previous state from active tab
                        openingPos: undefined,
                        isVisible: false,
                        assetInfo: {},
                        title: activeInlineTab.value?.assetSidebar.title ?? '',
                        id: activeInlineTab.value?.assetSidebar.id ?? '',
                    },
                }
                inlineTabAdd(inlineTabData, tabs, activeInlineTabKey)
                // selectionObject.value.startLineNumber = 2
                // selectionObject.value.startColumnNumber = 1
                // selectionObject.value.endLineNumber = 2
                // selectionObject.value.endColumnNumber = query.length + 1 // +1 for semicolon
                // setSelection(
                //     toRaw(editorInstanceRef.value),
                //     toRaw(monacoInstanceRef.value),
                //     selectionObject.value
                // )
                // queryRun(
                //     activeInlineTab,
                //     getData,
                //     limitRows,
                //     null,
                //     null,
                //     query,
                //     editorInstance,
                //     monacoInstance
                // )
            }

            const setContextInEditor = (item) => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)

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

            return {
                // showContextModal,
                // closeContextModal,
                // openInCurrentTab,
                // openInNewTab,

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
                openSidebar,
                setContextInEditor,
                readOnly,
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
    .from-gray-light-color {
        --tw-gradient-from: #f8f8f8;
        --tw-gradient-stops: var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(248, 248, 248, 0));
    }

    .bg-gray-light-color {
        --tw-bg-opacity: 1;
        background-color: rgba(248, 248, 248, var(--tw-bg-opacity));
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
        width: 18px;
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
