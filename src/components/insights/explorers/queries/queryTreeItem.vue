<template>
    <div
        :id="`${item.qualifiedName}`"
        class="h-auto"
        :class="`w-full group ${item.qualifiedName}`"
        :data-test-id="item?.guid"
    >
        <!-- {{ errorNode }} -->

        <div class="flex justify-between w-full overflow-hidden">
            <div class="flex w-full">
                <div
                    v-if="item.typeName === 'Folder' && item.isCta !== 'cta'"
                    class="relative flex content-center w-full h-8 my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <div class="py-1.5 w-full">
                        <div class="flex w-11/12 parent-ellipsis-container">
                            <AtlanIcon
                                :icon="
                                    expandedKeys.find((key) => key === item.key)
                                        ? 'FolderOpen'
                                        : 'FolderClosed'
                                "
                                class="w-4 h-4 my-auto mr-1 parent-ellipsis-container-extension"
                                color="#5277D7"
                            ></AtlanIcon>
                            <span
                                class="mt-0.5 text-sm text-gray-700 parent-ellipsis-container-base"
                                >{{ title(item) }}</span
                            >
                            <div
                                :id="`${item.qualifiedName}-menu`"
                                class="absolute top-0 right-0 flex items-center h-full text-gray-500 opacity-0 margin-align-top group-hover:opacity-100"
                            >
                                <InsightsThreeDotMenu
                                    @click.stop="() => {}"
                                    :options="dropdownFolderOptions"
                                    :item="item"
                                >
                                    <template #menuTrigger>
                                        <div
                                            class="px-2"
                                            v-if="hasWritePermission"
                                        >
                                            <div
                                                class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                            >
                                                <AtlanIcon
                                                    icon="KebabMenuHorizontal"
                                                    class="w-4 h-4 my-auto"
                                                ></AtlanIcon>
                                            </div>
                                        </div>
                                    </template>
                                </InsightsThreeDotMenu>
                            </div>
                        </div>
                    </div>
                </div>
                <!--Empty NODE -->
                <div
                    v-else-if="
                        item.typeName === 'Folder' && item.isCta === 'cta'
                    "
                    class="relative flex content-center w-full h-10 pt-1 my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <div class="w-full">
                        <div class="flex w-11/12">
                            <span
                                class="text-sm text-gray-700 text-new-gray-600"
                                >empty folder, create a
                                <span
                                    @click="newQuery"
                                    class="cursor-pointer text-new-blue-400 hover:underline"
                                    >query</span
                                >,
                                <span
                                    @click="newVisualQuery"
                                    class="cursor-pointer text-new-blue-400 hover:underline"
                                    >visual query</span
                                >
                                or a
                                <span
                                    @click="newFolder"
                                    class="cursor-pointer text-new-blue-400 hover:underline"
                                    >folder
                                </span></span
                            >
                            <!-- <div
                                :id="`${item.qualifiedName}-menu`"
                                class="absolute top-0 right-0 flex items-center h-full text-gray-500 opacity-0 margin-align-top group-hover:opacity-100"
                            ></div> -->
                        </div>
                    </div>
                    <!-- {{ item.title }} -->
                </div>

                <!------------------------------->
                <!-- Popover Allowed -->

                <PopoverAsset
                    v-else-if="item.typeName === 'Query'"
                    :item="item"
                    placement="right"
                    mouse-enter-delay="0.6"
                    @previewAsset="openSidebar"
                >
                    <div
                        :id="`${item.qualifiedName}`"
                        class="relative flex content-center w-full h-8 my-auto overflow-hidden text-sm leading-5 text-gray-700"
                    >
                        <div class="parent-ellipsis-container py-1.5 w-11/12">
                            <AtlanIcon
                                :icon="
                                    item?.attributes?.isVisualQuery
                                        ? getEntityStatusIcon(
                                              'vqb',
                                              certificateStatus(item)
                                          )
                                        : getEntityStatusIcon(
                                              'query',
                                              certificateStatus(item)
                                          )
                                "
                                class="w-4 h-4 my-auto mr-1 parent-ellipsis-container-extension"
                                color="#5277D7"
                            ></AtlanIcon>
                            <span
                                class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                                >{{ title(item) }}</span
                            >

                            <div
                                class="absolute flex items-center text-gray-500 opacity-0 margin-align-top group-hover:opacity-100"
                                :class="[
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-tree-light-color via-tree-light-color',
                                    hasWritePermission ? 'right-8' : 'right-0',
                                ]"
                            >
                                <div
                                    :data-test-id="'run-saved-query'"
                                    class="ml-24"
                                    @click="() => actionClick('play', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title>Run Query</template>
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

                                <div
                                    class="pl-1"
                                    @click.stop="
                                        () => actionClick('info', item)
                                    "
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
                            </div>
                            <div
                                :id="`${item.qualifiedName}-menu`"
                                class="absolute top-0 flex items-center h-full text-gray-500 opacity-0 right-1.5 margin-align-top group-hover:opacity-100"
                                @click.stop="() => {}"
                            >
                                <InsightsThreeDotMenu
                                    :options="dropdownQueryOptions"
                                    :item="item"
                                >
                                    <template #menuTrigger>
                                        <div
                                            class="pl-2"
                                            v-if="hasWritePermission"
                                        >
                                            <div
                                                class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                                            >
                                                <AtlanIcon
                                                    icon="KebabMenuHorizontal"
                                                    class="w-4 h-4 my-auto"
                                                ></AtlanIcon>
                                            </div>
                                        </div>
                                    </template>
                                </InsightsThreeDotMenu>
                            </div>
                        </div>
                    </div>
                </PopoverAsset>
            </div>
        </div>
    </div>
    <!-- <a-popover :visible="showDeletePopover" placement="rightTop">
        <template #content> -->
    <TreeDeletePopover
        :item="item"
        :is-saving="isDeleteLoading"
        :show-delete-popover="showDeletePopover"
        @cancel="showDeletePopover = false"
        @delete="() => delteItem(item?.typeName)"
    />
    <!-- </template>
    </a-popover> -->
    <!-- <a-popover :visible="showPublishPopover" placement="right">
        <template #content>
            <div class="p-4">
                <QueryFolderSelector
                    :connector="currentConnector"
                    :savedQueryType="savedQueryType"
                    @folderChange="getSelectedFolder"
                    :selectedNewFolder="item"
                />

                <div class="flex justify-end w-full">
                    <a-button
                        class="px-5 mr-4 text-sm border rounded"
                        style="width: 100px"
                        type="default"
                        @click="showPublishPopover = false"
                        >Cancel</a-button
                    >
                    <a-button
                        class="px-5 text-sm rounded"
                        type="primary"
                        @click="changeFolder(item)"
                        :loading="isUpdating"
                        >Move</a-button
                    >
                </div>
            </div>
        </template>
    </a-popover> -->

    <a-modal
        :visible="scheduleQueryModal"
        :footer="null"
        :closable="false"
        width="700px"
        :destroyOnClose="true"
    >
        <ScheduleQuery
            :item="item"
            v-model:scheduleQueryModal="scheduleQueryModal"
            style="min-height: 610px"
            class="rounded-lg"
        />
    </a-modal>

    <a-popover :visible="showFolderPopover" placement="rightTop">
        <template #content>
            <div>
                <QueryFolderSelector
                    :connector="currentConnector"
                    :saved-query-type="savedQueryType"
                    :selected-new-folder="item"
                    @folderChange="getSelectedFolder"
                />

                <div class="flex justify-end w-full pt-1 pb-4 pr-4">
                    <a-button
                        class="px-5 mr-4 text-sm border rounded"
                        style="width: 100px"
                        type="default"
                        @click="showFolderPopover = false"
                        >Cancel</a-button
                    >
                    <a-button
                        class="px-5 text-sm rounded"
                        type="primary"
                        :loading="isUpdating"
                        @click="changeFolder(item)"
                        >Move</a-button
                    >
                </div>
            </div>
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
        computed,
    } from 'vue'

    import StatusBadge from '@common/badge/status/index.vue'
    import { useRoute, useRouter } from 'vue-router'
    import Tooltip from '@common/ellipsis/index.vue'
    import { message } from 'ant-design-vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { useAccess } from '~/components/insights/common/composables/useAccess'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import TreeDeletePopover from '~/components/insights/common/treeDeletePopover.vue'
    import QueryFolderSelector from './queryFolderSelector2.vue'

    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { assetInterface } from '~/types/assets/asset.interface'

    import { Insights } from '~/services/meta/insights/index'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import AtlanBtn from '@/UI/button.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import { QueryCollection } from '~/types/insights/savedQuery.interface'
    import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'
    import Tooltip from '@common/ellipsis/index.vue'
    import ScheduleQuery from '~/components/insights/explorers/queries/schedule/index.vue'

    // vqb icons
    import Vqb from '~/assets/images/icons/Vqb.svg?raw'
    import VqbVerified from '~/assets/images/icons/VqbVerified.svg?raw'
    import VqbDeprecated from '~/assets/images/icons/VqbDeprecated.svg?raw'
    import VqbDraft from '~/assets/images/icons/VqbDraft.svg?raw'

    // query
    import Query from '~/assets/images/icons/query.svg?raw'
    import QueryVerified from '~/assets/images/icons/query-verified.svg?raw'
    import QueryDeprecated from '~/assets/images/icons/query-deprecated.svg?raw'
    import QueryDraft from '~/assets/images/icons/query-draft.svg?raw'
    import InsightsThreeDotMenu from '~/components/insights/common/dropdown/index.vue'
    import { MenuItem, SubMenu } from 'ant-design-vue'

    const {
        inlineTabRemove,
        modifyActiveInlineTabEditor,
        modifyActiveInlineTab,
    } = useInlineTab()
    const {
        focusEditor,
        setSelection,
        resetErrorDecorations,
        setErrorDecorations,
    } = useEditor()

    export default defineComponent({
        components: {
            StatusBadge,
            TreeDeletePopover,
            QueryFolderSelector,
            PopoverAsset,
            AtlanBtn,
            Tooltip,
            InsightsThreeDotMenu,
            ScheduleQuery,
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
            connector: {
                type: String as PropType<string | undefined>,
                required: true,
                default: '',
            },
            refreshQueryTree: {
                type: Function,
                required: false,
            },
            isNodeLoading: {
                type: Boolean,
                required: false,
            },
            nodeError: {
                type: String,
                required: false,
            },
            errorNode: {
                type: Object,
                required: false,
            },
            // parentFolderQF: {
            //     type: String,
            //     required: true,
            //     default: 'root',
            // },
            // refetchTreeData: {
            //     type: Function,
            //     required: false,
            //     default: () => {},
            // },
        },
        setup(props, { emit }) {
            const { canUserDeleteFolder } = useAccess()
            const {
                expandedKeys,
                item,
                errorNode,
                connector: currentConnector,
            } = toRefs(props)
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                title,
                certificateStatus,
            } = useAssetInfo()

            const route = useRoute()
            const router = useRouter()
            const scheduleQueryModal = ref(false)

            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const editorInstanceRef = inject('editorInstance') as Ref<any>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const createFolderInput =
                inject<(guid: string) => void>('createFolderInput')

            const toggleCreateQueryModal = inject<
                (guid: string, isVQB: boolean) => void
            >('toggleCreateQueryModal')

            const savedQueryType = inject('savedQueryType') as Ref<object>
            const permissions = inject('permissions') as ComputedRef<any>

            const isCollectionCreatedByCurrentUser = inject(
                'isCollectionCreatedByCurrentUser'
            ) as ComputedRef
            const hasCollectionReadPermission = inject(
                'hasCollectionReadPermission'
            ) as ComputedRef
            const hasCollectionWritePermission = inject(
                'hasCollectionWritePermission'
            ) as ComputedRef

            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >

            const updateAssetCheck = inject('updateAssetCheck') as Ref<Boolean>

            const collectionName = computed(() => {
                const col = queryCollections.value?.find(
                    (col) =>
                        col.attributes.qualifiedName ===
                        item.value.attributes.collectionQualifiedName
                )
                return col?.displayText
            })

            const hasWritePermission = computed(
                () =>
                    hasCollectionWritePermission.value ||
                    isCollectionCreatedByCurrentUser.value
            )

            const refetchParentNode = inject<
                (
                    guid: string | 'root',
                    type: 'query' | 'Folder',
                    tree?: 'personal' | 'all'
                ) => void
            >('refetchParentNode', () => {})

            const refetchNode = inject<
                (
                    guid: string,
                    type: 'query' | 'Folder',
                    tree?: 'personal' | 'all'
                ) => void
            >('refetchNode', () => {})

            const refetchNodeLocally = inject<
                (
                    guid: string,
                    type: 'query' | 'Folder',
                    tree?: 'personal' | 'all'
                ) => void
            >('refetchNodeLocally', () => {})

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            // add comment
            const { openSavedQueryInNewTabAndRun, duplicateSavedQuery } =
                useSavedQuery(inlineTabs, activeInlineTab, activeInlineTabKey)

            const { isSameNodeOpenedInSidebar } = useSchema()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )
            const showDeletePopover = ref(false)
            const showPublishPopover = ref(false)
            const showFolderPopover = ref(false)

            const onRunCompletion = (activeInlineTab, status: string) => {
                console.log('tree item: ', { status, activeInlineTab })
                if (status === 'success') {
                    /* Resetting the red dot from the editor if it error is not line type */
                    resetErrorDecorations(
                        activeInlineTab,
                        toRaw(editorInstance.value)
                    )
                } else if (status === 'error') {
                    console.log('tree item: ', { status, activeInlineTab })
                    resetErrorDecorations(
                        activeInlineTab,
                        toRaw(editorInstance.value)
                    )
                    // console.log('error deco:', status)
                    /* If it is a line error i,e VALIDATION_ERROR | QUERY_PARSING_ERROR */
                    const errorName =
                        activeInlineTab.value?.playground?.resultsPane?.result
                            ?.queryErrorObj?.errorName

                    console.log(
                        'tree item error data: ',
                        activeInlineTab.value?.playground?.resultsPane?.result
                            ?.queryErrorObj?.errorName
                    )
                    if (LINE_ERROR_NAMES.includes(errorName)) {
                        setErrorDecorations(
                            activeInlineTab,
                            toRaw(editorInstance),
                            toRaw(monacoInstance)
                        )
                    }
                }
            }

            const onQueryIdGeneration = (
                activeInlineTab,
                queryId: string,
                eventSource: any
            ) => {
                /* Setting the particular instance to this tab */
                activeInlineTab.value.playground.resultsPane.result.runQueryId =
                    queryId
                activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
                    eventSource
            }

            const actionClick = (action: string, t: assetInterface) => {
                /* Here t->enity->assetInfo */
                switch (action) {
                    case 'add': {
                        const editorInstance = toRaw(editorInstanceRef.value)
                        editorInstance.trigger('keyboard', 'type', {
                            text: `${title(t)} `,
                        })
                        break
                    }
                    case 'info': {
                        // i button clicked on the same node -> close the sidebar
                        if (isSameNodeOpenedInSidebar(t, activeInlineTab)) {
                            /* Close it if it is already opened */
                            closeAssetSidebar(activeInlineTab.value)
                        } else {
                            const activeInlineTabCopy: activeInlineTabInterface =
                                { ...activeInlineTab.value }

                            // console.log('query entity1: ', t)
                            activeInlineTabCopy.assetSidebar.assetInfo =
                                t.entity
                            activeInlineTabCopy.assetSidebar.isVisible = true
                            openAssetSidebar(activeInlineTabCopy, 'not_editor')
                        }

                        break
                    }
                    case 'play': {
                        openSavedQueryInNewTabAndRun(
                            item,
                            getData,
                            limitRows,
                            editorInstance,
                            monacoInstance,
                            onRunCompletion,
                            onQueryIdGeneration
                        )
                        break
                    }
                    case 'duplicate': {
                        duplicateSavedQuery(item)
                        break
                    }
                    case 'bookmark': {
                        break
                    }
                }
            }

            const limitRows = ref({
                checked: true,
                rowsCount: 100,
            })
            const editorInstance = inject('editorInstance') as Ref<any>
            const monacoInstance = inject('monacoInstance') as Ref<any>

            const el1 = document.getElementById(`${item.value.qualifiedName}`)
            const el2 = document.getElementById(
                `${item.value.qualifiedName}-menu`
            )

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
                        true,
                        saveQueryDataInLocalStorage
                    )
                    // setSelection(
                    //     toRaw(editorInstanceRef.value),
                    //     toRaw(monacoInstanceRef.value),
                    //     selectionObject.value
                    // )
                    focusEditor(toRaw(editorInstanceRef.value))
                }
            }

            const newQuery = () => {
                removeBackground()
                const isVQB = false
                if (toggleCreateQueryModal) {
                    toggleCreateQueryModal(item, isVQB)
                }
            }

            const newVisualQuery = () => {
                removeBackground()
                const isVQB = true
                if (toggleCreateQueryModal) {
                    toggleCreateQueryModal(item, isVQB)
                }
            }

            const newFolder = () => {
                if (createFolderInput) createFolderInput()
            }

            const addBackground = (visible) => {
                console.log('element: ', visible)
                const el1 = document.getElementById(
                    `${item.value.qualifiedName}`
                )
                const el2 = document.getElementById(
                    `${item.value.qualifiedName}-menu`
                )

                if (visible) {
                    // el1.classList.add('bg-gray-light')
                    el2.classList.add('opacity-100')
                } else {
                    // el1.classList.remove('bg-gray-light')
                    el2.classList.remove('opacity-100')
                }
            }

            const removeBackground = () => {
                const el1 = document.getElementById(
                    `${item.value.qualifiedName}`
                )
                const el2 = document.getElementById(
                    `${item.value.qualifiedName}-menu`
                )
                if (el1) {
                    // el1.classList.remove('bg-gray-light')
                }
                if (el2) {
                    el2.classList.remove('opacity-100')
                }
            }
            const renameFolder = () => {
                removeBackground()
                const orignalName = item.value.attributes.name
                const parentNode = document.getElementsByClassName(
                    `${item.value.qualifiedName}`
                )[0]

                const childNode = parentNode?.firstChild as HTMLElement
                childNode?.classList?.add('hidden')

                const input = document.createElement('input')
                input.setAttribute(
                    'class',
                    `outline-none py-0 px-1 rounded mx-0 my-0.5 w-full bg-transparent`
                )
                input.classList.add(`${item.value.qualifiedName}-rename-input`)

                const div = document.createElement('div')
                div.classList.add('flex', 'items-center', 'active-input', 'h-8')

                const folderCloseSvg =
                    '<span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.49951 2H3.49951C2.94723 2 2.49951 2.44772 2.49951 3V11.5C2.49951 12.0523 2.94723 12.5 3.49951 12.5H11.4995C12.0518 12.5 12.4995 12.0523 12.4995 11.5V5C12.4995 4.44772 12.0518 4 11.4995 4H7.49951C6.94723 4 6.49951 3.55228 6.49951 3C6.49951 2.44772 6.0518 2 5.49951 2Z" fill="white" stroke="#5277D7"/><path d="M13.3266 6H2.61167C2.01741 6 1.55428 6.51516 1.61731 7.10607L2.20398 12.6061C2.2582 13.1144 2.68711 13.5 3.19833 13.5H12.4466C12.9379 13.5 13.3564 13.1431 13.4341 12.658L14.3141 7.15799C14.4113 6.55041 13.9419 6 13.3266 6Z" fill="white" stroke="#5277D7"/></svg></span>'

                const folderOpenSvg =
                    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.49951 2H3.49951C2.94723 2 2.49951 2.44771 2.49951 3V12.3C2.49951 12.8523 2.94723 13.3 3.49951 13.3H11.4995C12.0518 13.3 12.4995 12.8523 12.4995 12.3V5C12.4995 4.44772 12.0518 4 11.4995 4H7.49951C6.94723 4 6.49951 3.55228 6.49951 3C6.49951 2.44772 6.0518 2 5.49951 2Z" fill="white" stroke="#5277D7"/><path d="M14.3433 7H5.48612C5.07234 7 4.7013 7.25483 4.55277 7.64102L2.822 12.141C2.57008 12.796 3.05357 13.5 3.75535 13.5H12.6125C13.0263 13.5 13.3973 13.2452 13.5459 12.859L15.2766 8.35898C15.5286 7.70398 15.0451 7 14.3433 7Z" fill="white" stroke="#5277D7"/></svg>'

                const folderSvg = expandedKeys.value.find(
                    (key) => key === item.value.key
                )
                    ? folderOpenSvg
                    : folderCloseSvg
                const querySvg =
                    '<span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="#5277D7"/><path d="M4 6L6 8L4 10" stroke="#5277D7" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11H12" stroke="#5277D7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
                let iconName: string = getEntityStatusIcon(
                    assetType(item.value),
                    certificateStatus(item.value)
                )
                if (item.value?.attributes.isVisualQuery) {
                    // for changing it to Vqb
                    iconName = iconName.replace('Query', 'Vqb')
                }
                const svgCollection = {
                    //FIXME: why Query imported svg not working
                    Query: `<span>${querySvg}</span>`,
                    QueryVerified: `<span>${QueryVerified}</span>`,
                    QueryDeprecated: `<span>${QueryDeprecated}</span>`,
                    QueryDraft: `<span>${QueryDraft}</span>`,
                    Vqb: `<span>${Vqb}</span>`,
                    VqbVerified: `<span>${VqbVerified}</span>`,
                    VqbDeprecated: `<span>${VqbDeprecated}</span>`,
                    VqbDraft: `<span>${VqbDraft}</span>`,
                }

                const folderSvgEl = new DOMParser().parseFromString(
                    item.value.typeName === 'Query'
                        ? svgCollection[iconName] ?? querySvg
                        : folderSvg,
                    'text/html'
                ).body.firstElementChild

                div.append(folderSvgEl)
                div.append(input)
                parentNode?.prepend(div)
                input.focus()
                input.value = ''
                input.value = item.value.attributes?.name

                let newName = item.value.attributes?.name

                input.addEventListener('keydown', (e) => {
                    // console.log('event: ', e)
                    if (e.key === 'Escape') {
                        // parentNode?.removeChild(div)
                        try {
                            parentNode?.removeChild(div)
                        } catch {}
                        childNode?.classList?.remove('hidden')
                    }
                    if (e.key === 'Enter') {
                        if (input.value && input.value !== orignalName) {
                            item.value.attributes.name = input.value
                            newName = input.value
                            const { data, error, isLoading } =
                                Insights.CreateQueryFolder(
                                    {
                                        entity: item.value.entity,
                                    },
                                    {}
                                )
                            // console.log('rename: ', { data, error })
                            watch(
                                error,
                                () => {
                                    // console.log('rename error: ', error)

                                    if (isLoading.value === false) {
                                        if (error.value === undefined) {
                                        } else {
                                            item.value.attributes.name =
                                                orignalName

                                            message.error({
                                                content: `${
                                                    item.value.typeName ===
                                                    'Query'
                                                        ? 'Query'
                                                        : 'Folder'
                                                } rename failed`,
                                            })
                                        }
                                    }
                                },
                                { immediate: true }
                            )

                            watch(data, () => {
                                // setTimeout(() => {
                                updateAssetCheck.value = true
                                message.success({
                                    content: `${
                                        item.value.typeName === 'Query'
                                            ? 'Query'
                                            : 'Folder'
                                    } renamed successfully`,
                                })

                                // if same tab renamed
                                if (
                                    activeInlineTab.value.attributes &&
                                    activeInlineTab?.value.queryId ===
                                        item?.value.guid
                                ) {
                                    const activeInlineTabCopy: activeInlineTabInterface =
                                        JSON.parse(
                                            JSON.stringify(
                                                toRaw(activeInlineTab.value)
                                            )
                                        )
                                    activeInlineTabCopy.attributes.name =
                                        newName
                                    activeInlineTabCopy.label = newName

                                    if (
                                        activeInlineTabCopy.assetSidebar
                                            .assetInfo.guid === item?.value.guid
                                    ) {
                                        activeInlineTabCopy.assetSidebar.assetInfo.attributes.name =
                                            newName
                                        activeInlineTabCopy.assetSidebar.assetInfo.displayText =
                                            newName
                                    }
                                    if (
                                        data.value?.mutatedEntities?.UPDATE
                                            ?.length > 0
                                    ) {
                                        activeInlineTabCopy.updateTime =
                                            data.value?.mutatedEntities?.UPDATE[0].updateTime
                                        activeInlineTabCopy.updatedBy =
                                            data.value?.mutatedEntities?.UPDATE[0].updatedBy
                                    }
                                    // debugger
                                    modifyActiveInlineTab(
                                        activeInlineTabCopy,
                                        inlineTabs,
                                        activeInlineTabCopy.isSaved,
                                        true
                                    )
                                } else {
                                    const index = inlineTabs.value.findIndex(
                                        (tab) =>
                                            tab.queryId === item?.value.guid
                                    )
                                    if (index < 0) return
                                    inlineTabs.value[index].attributes.name =
                                        input.value
                                    inlineTabs.value[index].label = newName

                                    if (
                                        data.value?.mutatedEntities?.UPDATE
                                            ?.length > 0
                                    ) {
                                        inlineTabs.value[index].updateTime =
                                            data.value?.mutatedEntities?.UPDATE[0].updateTime
                                        inlineTabs.value[index].updatedBy =
                                            data.value?.mutatedEntities?.UPDATE[0].updatedBy
                                    }
                                    if (
                                        inlineTabs.value[index].assetSidebar
                                            .assetInfo.guid === item?.value.guid
                                    ) {
                                        inlineTabs.value[
                                            index
                                        ].assetSidebar.assetInfo.attributes.name =
                                            newName
                                        inlineTabs.value[
                                            index
                                        ].assetSidebar.assetInfo.displayText = newName
                                    }
                                }

                                useAddEvent(
                                    'insights',
                                    item.value.typeName === 'Query'
                                        ? 'query'
                                        : 'folder',
                                    'renamed',
                                    undefined
                                )
                                // }, 200)
                            })
                        }
                        input.value = ''
                        try {
                            parentNode?.removeChild(div)
                        } catch {}
                        childNode?.classList?.remove('hidden')
                    }
                })
                input.addEventListener('blur', (e) => {
                    // console.log('rename error blur: ', error)
                    if (input.value && input.value !== orignalName) {
                        item.value.attributes.name = input.value
                        newName = input.value
                        const { data, error, isLoading } =
                            Insights.CreateQueryFolder(
                                {
                                    entity: item.value.entity,
                                },
                                {}
                            )

                        watch(
                            error,
                            () => {
                                // console.log('rename error blur: ', error)

                                if (isLoading.value === false) {
                                    if (error.value === undefined) {
                                    } else {
                                        item.value.attributes.name = orignalName

                                        message.error({
                                            content: `${
                                                item.value.typeName === 'Query'
                                                    ? 'Query'
                                                    : 'Folder'
                                            } rename failed`,
                                        })
                                    }
                                }
                            },
                            { immediate: true }
                        )

                        watch(data, () => {
                            if (data.value !== undefined) {
                                // setTimeout(() => {
                                updateAssetCheck.value = true
                                message.success({
                                    content: `${
                                        item.value.typeName === 'Query'
                                            ? 'Query'
                                            : 'Folder'
                                    } renamed successfully`,
                                })
                                if (
                                    activeInlineTab.value.attributes &&
                                    activeInlineTab?.value.queryId ===
                                        item?.value.guid
                                ) {
                                    const activeInlineTabCopy: activeInlineTabInterface =
                                        JSON.parse(
                                            JSON.stringify(
                                                toRaw(activeInlineTab.value)
                                            )
                                        )
                                    activeInlineTabCopy.attributes.name =
                                        newName
                                    activeInlineTabCopy.label = newName

                                    if (
                                        activeInlineTabCopy.assetSidebar
                                            .assetInfo.guid === item?.value.guid
                                    ) {
                                        activeInlineTabCopy.assetSidebar.assetInfo.attributes.name =
                                            newName
                                        activeInlineTabCopy.assetSidebar.assetInfo.displayText =
                                            newName
                                    }

                                    if (
                                        data.value?.mutatedEntities?.UPDATE
                                            ?.length > 0
                                    ) {
                                        activeInlineTabCopy.updateTime =
                                            data.value?.mutatedEntities?.UPDATE[0].updateTime
                                        activeInlineTabCopy.updatedBy =
                                            data.value?.mutatedEntities?.UPDATE[0].updatedBy
                                    }
                                    modifyActiveInlineTab(
                                        activeInlineTabCopy,
                                        inlineTabs,
                                        activeInlineTabCopy.isSaved,
                                        true
                                    )
                                } else {
                                    const index = inlineTabs.value.findIndex(
                                        (tab) =>
                                            tab.queryId === item?.value.guid
                                    )
                                    if (index < 0) return
                                    inlineTabs.value[index].attributes.name =
                                        input.value
                                    inlineTabs.value[index].label = newName

                                    if (
                                        data.value?.mutatedEntities?.UPDATE
                                            ?.length > 0
                                    ) {
                                        inlineTabs.value[index].updateTime =
                                            data.value?.mutatedEntities?.UPDATE[0].updateTime
                                        inlineTabs.value[index].updatedBy =
                                            data.value?.mutatedEntities?.UPDATE[0].updatedBy
                                    }
                                    if (
                                        inlineTabs.value[index].assetSidebar
                                            .assetInfo.guid === item?.value.guid
                                    ) {
                                        inlineTabs.value[
                                            index
                                        ].assetSidebar.assetInfo.attributes.name =
                                            newName
                                        inlineTabs.value[
                                            index
                                        ].assetSidebar.assetInfo.displayText = newName
                                    }
                                }

                                useAddEvent(
                                    'insights',
                                    'folder',
                                    'renamed',
                                    undefined
                                )
                            }
                            // }, 200)
                        })
                    }
                    try {
                        parentNode?.removeChild(div)
                    } catch {}
                    childNode?.classList?.remove('hidden')
                })
            }

            const toggleScheduleQueryModal = (
                e: any,
                cancel: boolean | undefined
            ) => {
                if (cancel) {
                } else scheduleQueryModal.value = !scheduleQueryModal.value
            }

            let isDeleteLoading = ref(false)

            const pushGuidToURL = (guid: string | undefined) => {
                const queryParams = {}
                if (route?.query?.vqb) queryParams.vqb = true
                if (guid) {
                    queryParams.id = guid
                    router.push({ path: `insights`, query: queryParams })
                } else {
                    router.push({ path: `insights`, query: queryParams })
                }
            }

            const delteItem = (type: 'Query' | 'Folder') => {
                const key = item.value.guid
                const parentGuid = item?.value?.attributes?.parent?.guid
                console.log('delete item: ', item)
                const { data, error, isLoading } = Insights.DeleteEntity(
                    item.value.guid,
                    {}
                )
                isDeleteLoading.value = true

                watch([data, error, isLoading], ([newData, newError]) => {
                    // debugger
                    isDeleteLoading.value = isLoading.value
                    console.log('delete: ', isLoading.value)
                    if (newData && !newError) {
                        showDeletePopover.value = false

                        inlineTabRemove(
                            key,
                            inlineTabs,
                            activeInlineTabKey,
                            pushGuidToURL
                        )

                        // find the parent of the deleted node
                        // filter the children of the parent where key != deleted node's key
                        // children is empty? add cta

                        // Dont refetch node, only add a child to it
                        setTimeout(() => {
                            // refetchNode(
                            //     parentGuid,
                            //     type === 'Query' ? 'query' : 'Folder'
                            // )
                            refetchNodeLocally(
                                parentGuid,
                                type === 'Query' ? 'query' : 'Folder'
                            )
                        }, 1000)

                        message.success({
                            content: `${item.value?.attributes?.name} deleted!`,
                        })
                        useAddEvent('insights', 'folder', 'deleted', undefined)
                        // refetchParentNode(
                        //     props.item.guid,
                        //     type === 'Query' ? 'query' : 'Folder',
                        //     savedQueryType.value
                        // )
                    }
                })
            }
            const evaluatePermisson = (
                savedQueryType,
                typeOfAsset,
                permission
            ) => {
                // console.log(savedQueryType, typeOfAsset, permission)
                if (typeOfAsset === 'folder') {
                    if (savedQueryType === 'personal') {
                        switch (permission) {
                            case 'UPDATE': {
                                if (permissions.value.private.updateFolder)
                                    return true
                                return false
                            }
                            case 'DELETE': {
                                if (permissions.value.private.deleteFolder)
                                    return true
                                return false
                            }
                            case 'CREATE': {
                                if (permissions.value.private.createFolder)
                                    return true
                                return false
                            }
                            case 'MOVE': {
                                if (
                                    permissions.value.private
                                        .privateToPublicFolder
                                )
                                    return true
                                return false
                            }
                        }
                    } else {
                        switch (permission) {
                            case 'UPDATE': {
                                if (permissions.value.public.updateFolder)
                                    return true
                                return false
                            }
                            case 'DELETE': {
                                if (permissions.value.public.deleteFolder)
                                    return true
                                return false
                            }
                            case 'CREATE': {
                                if (permissions.value.public.createFolder)
                                    return true
                                return false
                            }
                        }
                    }
                }
                if (typeOfAsset === 'query') {
                    if (savedQueryType === 'personal') {
                        switch (permission) {
                            case 'UPDATE': {
                                if (permissions.value.private.updateQuery)
                                    return true
                                return false
                            }
                            case 'DELETE': {
                                if (permissions.value.private.deleteQuery)
                                    return true
                                return false
                            }
                            case 'MOVE': {
                                if (
                                    permissions.value.private
                                        .privateToPublicQuery
                                )
                                    return true
                                return false
                            }
                        }
                    } else {
                        switch (permission) {
                            case 'UPDATE': {
                                if (permissions.value.public.updateQuery)
                                    return true
                                return false
                            }
                            case 'DELETE': {
                                if (permissions.value.public.deleteQuery)
                                    return true
                                return false
                            }
                        }
                    }
                }
            }

            const selectedFolder = ref(null)

            const getSelectedFolder = (folder) => {
                if (folder) {
                    console.log('folder selected', folder?.dataRef)
                    selectedFolder.value = folder?.dataRef
                } else {
                    console.log('no folder selected')
                    selectedFolder.value = null
                }
            }

            const isUpdating = ref(false)

            const changeFolder = (item: any) => {
                // console.log('item to move: ', item)
                const previousParentGuId = item.attributes.parent.guid
                const selectedParentGuid = selectedFolder?.value?.guid

                // console.log('entity item parent: ', previousParentGuId)
                // console.log('entity selected folder: ', selectedParentGuid)

                // console.log('selected folder:', selectedFolder.value)

                if (selectedFolder.value) {
                    const newEntity = { ...item, relationshipAttributes: {} }
                    delete newEntity.entity

                    if (selectedFolder.value.typeName === 'Collection') {
                        newEntity.relationshipAttributes = {
                            parent: {
                                guid: selectedParentGuid,
                                typeName: selectedFolder.value.typeName,
                            },
                        }
                        newEntity.attributes = {
                            ...newEntity.attributes,
                            parent: {
                                guid: selectedParentGuid,
                                typeName: selectedFolder.value.typeName,
                            },
                            parentQualifiedName:
                                selectedFolder.value.attributes.qualifiedName,
                        }
                        // console.log('select QFN')
                        // if (selectedType.value?.name) {
                        newEntity.classifications = []

                        // } else {
                        //     newEntity.classifications = []
                        // }
                    } else if (selectedFolder.value.typeName === 'Folder') {
                        newEntity.relationshipAttributes = {
                            parent: {
                                guid: selectedParentGuid,
                                typeName: selectedFolder.value.typeName,
                            },
                        }
                        newEntity.attributes = {
                            ...newEntity.attributes,
                            parent: {
                                guid: selectedParentGuid,
                                typeName: selectedFolder.value.typeName,
                            },
                            parentQualifiedName:
                                selectedFolder.value.attributes.qualifiedName,
                        }
                        newEntity.classifications = []
                    }

                    // console.log('new entity: ', newEntity)

                    isUpdating.value = true

                    if (item.typeName == 'Folder') {
                        const { data, error, isLoading } =
                            Insights.UpdateSavedFolder(
                                {
                                    entity: newEntity,
                                },
                                {}
                            )
                        watch([error, data, isLoading], (newError) => {
                            // if (newError) {

                            if (isLoading.value == false) {
                                isUpdating.value = false
                                if (error.value == undefined) {
                                    // props.refetchTreeData()

                                    setTimeout(async () => {
                                        await refetchNode(
                                            previousParentGuId,
                                            'Folder'
                                        )
                                    }, 1000)
                                    setTimeout(async () => {
                                        await refetchNode(
                                            selectedParentGuid,
                                            'Folder'
                                        )
                                    }, 2000)

                                    message.success(`Folder moved successfully`)
                                } else {
                                    message.success(`Folder move failed`)
                                }
                            }
                            showPublishPopover.value = false
                            showFolderPopover.value = false
                        })
                    } else if (item.typeName === 'Query') {
                        const { data, error, isLoading } =
                            Insights.UpdateSavedQuery(
                                {
                                    entity: newEntity,
                                },
                                {}
                            )
                        watch([error, data, isLoading], (newError) => {
                            // if (newError) {

                            if (isLoading.value == false) {
                                isUpdating.value = false
                                if (error.value == undefined) {
                                    setTimeout(async () => {
                                        await refetchNode(
                                            previousParentGuId,
                                            'query'
                                        )
                                    }, 1000)
                                    setTimeout(async () => {
                                        await refetchNode(
                                            selectedParentGuid,
                                            'query'
                                        )
                                    }, 2000)

                                    message.success('Query moved successfully')
                                    updateAssetCheck.value = true
                                } else {
                                    message.success(`Query move failed`)
                                }
                            }
                            showFolderPopover.value = false
                            showPublishPopover.value = false

                            // console.log('update data change folder: ', data)
                        })
                    }
                }
            }

            const openSidebar = () => {
                removeBackground()
                const activeInlineTabCopy: activeInlineTabInterface = {
                    ...activeInlineTab.value,
                }
                activeInlineTabCopy.assetSidebar.assetInfo = item.value
                activeInlineTabCopy.assetSidebar.isVisible = true
                openAssetSidebar(activeInlineTabCopy, 'not_editor')
            }

            const copyURL = () => {
                removeBackground()
                const URL = `${
                    window.location.host + window.location.pathname
                }?id=${item?.value?.guid}`
                copyToClipboard(URL)
                message.success('Link Copied!')
                useAddEvent('insights', 'query', 'link_copied', undefined)
            }

            const dropdownQueryOptions = [
                {
                    title: 'Copy link',
                    key: 'copyLink',
                    class: 'border-b border-gray-300',
                    component: MenuItem,
                    disabled: false,
                    handleClick: copyURL,
                },
                {
                    title: 'Duplicate',
                    key: 'duplicate',
                    class: '',
                    disabled: false,
                    component: MenuItem,
                    handleClick: ({ item }) => {
                        actionClick('duplicate', item)
                    },
                },
                {
                    title: 'Move Query',

                    key: 'move',
                    class: 'border-b border-gray-300',
                    component: MenuItem,
                    disabled: false,
                    handleClick: () => {
                        showFolderPopover.value = true
                    },
                },
                {
                    title: 'Rename',

                    key: 'rename',
                    class: '',
                    component: MenuItem,
                    disabled: false,
                    handleClick: renameFolder,
                },
                {
                    title: 'Edit',

                    key: 'edit',
                    class: 'border-b border-gray-300',
                    component: MenuItem,
                    disabled: false,
                    handleClick: ({ item }) => {
                        actionClick('info', item)
                    },
                },
                {
                    title: 'Delete',

                    key: 'delete',
                    class: 'text-red-600',
                    component: MenuItem,
                    disabled: false,
                    handleClick: () => {
                        showDeletePopover.value = true
                    },
                },
            ]
            const dropdownFolderOptions = [
                {
                    title: 'New folder',
                    key: 'new',
                    class: '',
                    disabled: false,
                    component: MenuItem,
                    handleClick: newFolder,
                },
                {
                    title: 'Rename',
                    key: 'rename',
                    class: '',
                    disabled: false,
                    component: MenuItem,
                    handleClick: renameFolder,
                },
                {
                    title: 'New query',
                    key: 'newQuery',
                    component: MenuItem,
                    class: '',
                    disabled: false,
                    handleClick: newQuery,
                },
                {
                    title: 'New visual query',
                    key: 'newVisualQuery',
                    component: MenuItem,
                    class: '',
                    disabled: false,
                    handleClick: newVisualQuery,
                },
                {
                    title: 'Move folder',
                    key: 'moveFolder',
                    component: MenuItem,
                    class: 'border-b border-gray-300',
                    disabled: false,
                    handleClick: () => {
                        showFolderPopover.value = true
                    },
                },
                {
                    title: 'Delete',

                    key: 'delete',
                    class: 'text-red-600',
                    component: MenuItem,
                    disabled: false,
                    handleClick: () => {
                        showDeletePopover.value = true
                    },
                },
            ]

            return {
                dropdownFolderOptions,
                dropdownQueryOptions,
                scheduleQueryModal,
                toggleScheduleQueryModal,
                evaluatePermisson,
                permissions,
                canUserDeleteFolder,
                certificateStatus,
                renameFolder,
                delteItem,
                newQuery,
                newVisualQuery,
                newFolder,
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
                showFolderPopover,
                getEntityStatusIcon,
                currentConnector,
                getSelectedFolder,
                selectedFolder,
                changeFolder,
                isUpdating,
                isDeleteLoading,
                openSidebar,
                isCollectionCreatedByCurrentUser,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
                hasWritePermission,
                copyURL,
                collectionName,
                addBackground,
                removeBackground,
                createFolderInput,
                // input,
                // newFolderName,
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
        @apply bg-new-gray-300;
    }
    .via-tree-light-color {
        --tw-gradient-stops: var(--tw-gradient-from), #eff1f5,
            var(--tw-gradient-to, rgba(244, 246, 253, 0)) !important;
    }
    .from-tree-light-color {
        --tw-gradient-from: #eff1f5 !important;
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
