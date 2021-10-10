<template>
    <div class="w-full group py-1.5">
        <div class="flex justify-between w-full overflow-hidden">
            <div class="flex w-full m-0">
                <div
                    class="flex content-center w-full my-auto overflow-hidden text-sm leading-5 text-gray-700 "
                >
                    <a-popover placement="rightTop">
                        <template #content>
                            <div>
                                <SchemaTreeItemPopover :item="item" />
                            </div>
                        </template>
                        <!--For Column-->
                        <div
                            v-if="assetType(item) == 'Column'"
                            class="relative flex items-center justify-between w-full  z"
                        >
                            <div class="flex w-full">
                                <component
                                    :is="dataTypeImage(item)"
                                    class="
                                        flex-none
                                        w-auto
                                        h-4
                                        mr-1
                                        mt-0.5
                                        text-gray-500
                                    "
                                ></component>
                                <span
                                    class="mb-0 text-sm leading-5 tracking-wide  nooverflow"
                                >
                                    {{ title(item) }}
                                </span>
                            </div>
                            <div
                                class="absolute right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
                                :class="
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light via-gray-light'
                                "
                            >
                                <div
                                    class="pl-2 ml-20"
                                    @click="() => actionClick('add', item)"
                                >
                                    <a-tooltip placement="top">
                                        <template #title
                                            >Place name in SQL</template
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
                                <div
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
                                </div>
                            </div>
                            <div
                                class="flex items-center text-xs text-gray-500"
                            >
                                <div
                                    class="flex items-center"
                                    v-if="isPrimary(item)"
                                >
                                    <a-tooltip>
                                        <template #title>Pkey</template>
                                        <AtlanIcon
                                            icon="PrimaryKey"
                                            class="w-4 h-4 my-auto mr-1  primary-key-color"
                                        ></AtlanIcon>
                                    </a-tooltip>
                                </div>
                                <span> {{ dataType(item) }}</span>
                            </div>
                        </div>
                        <!------------------------------->
                        <!--For Others -->
                        <div v-else class="relative flex w-full z">
                            <AtlanIcon
                                :icon="assetType(item)"
                                class="w-4 h-4 my-auto mr-1"
                            ></AtlanIcon>
                            <span
                                class="mb-0 text-sm leading-5 tracking-wide  nooverflow"
                            >
                                {{ title(item) }}
                            </span>
                            <div
                                class="absolute right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0  margin-align-top group-hover:opacity-100"
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
                                    <a-tooltip placement="top">
                                        <template #title
                                            >Place name in SQL</template
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
                                <div
                                    class="pr-2"
                                    @click.stop="
                                        () => actionClick('play', item)
                                    "
                                >
                                    <a-tooltip placement="top">
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
                                <div
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
                                </div>
                            </div>
                        </div>
                        <!------------------------------->
                    </a-popover>
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

    export default defineComponent({
        components: { SchemaTreeItemPopover },
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
            const isQueryRunning = inject('isQueryRunning') as Ref<string>

            const editorInstance = toRaw(editorInstanceRef.value)
            const monacoInstance = toRaw(monacoInstanceRef.value)
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
                        editorInstance,
                        monacoInstance,
                        selectionObject.value
                    )
                    focusEditor(editorInstance)
                }
            }
            // const selectAndFocus=()={

            // }

            const actionClick = (action: string, t: assetInterface) => {
                switch (action) {
                    case 'add': {
                        editorInstance.trigger('keyboard', 'type', {
                            text: `${t.title}`,
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
                        const newQuery = `\/* {{${item.value?.title}}} preview *\/\nSELECT * FROM \"${item.value?.title}\" LIMIT 50;\n`
                        const newText = `${newQuery}${prevText}`
                        activeInlineTabCopy.playground.editor.text = newText
                        modifyActiveInlineTab(activeInlineTabCopy, inlineTabs)
                        selectionObject.value.startLineNumber = 2
                        selectionObject.value.startColumnNumber = 1
                        selectionObject.value.endLineNumber = 2
                        selectionObject.value.endColumnNumber =
                            newQuery.length + 1 // +1 for semicolon
                        queryRun(activeInlineTabCopy, getData, isQueryRunning)

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
                            openAssetSidebar(activeInlineTabCopy)
                        }

                        break
                    }
                    case 'bookmark': {
                        break
                    }
                }
            }

            return {
                activeInlineTab,
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
    .nooverflow {
        display: inline-block;
        overflow: hidden !important;
        overflow-wrap: normal;
        text-overflow: ellipsis;
        white-space: nowrap !important;
        width: 0;
        min-width: 100%;
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
