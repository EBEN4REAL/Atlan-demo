<template>
    <div
        class="h-8"
        :class="`w-full group ${item.qualifiedName}`"
        :data-test-id="item?.guid"
    >
        <!-- {{ errorNode }} -->

        <div class="flex justify-between w-full overflow-hidden">
            <div class="flex w-full m-0">
                <div
                    v-if="item.typeName === 'Folder'"
                    class="relative flex content-center w-full h-8 my-auto overflow-hidden text-sm leading-5 text-gray-700"
                >
                    <div class="parent-ellipsis-container py-1.5">
                        <div class="flex w-full">
                            <AtlanIcon
                                :icon="
                                    expandedKeys.find((key) => key === item.key)
                                        ? 'FolderOpen'
                                        : 'FolderClosed'
                                "
                                class="w-4 h-4 my-auto mr-1"
                                color="#5277D7"
                            ></AtlanIcon>
                            <span
                                class="mt-0.5 text-sm text-gray-700 parent-ellipsis-container-base"
                                >{{ title(item) }}</span
                            >
                            <!-- <AtlanIcon
                                icon="Reload"
                                class="w-4 h-4 my-auto"
                                v-if="
                                    !isNodeLoading &&
                                    nodeError &&
                                    errorNode?.guid === item?.guid
                                "
                            ></AtlanIcon> -->
                            <div
                                class="absolute top-0 right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0 margin-align-top group-hover:opacity-100"
                            >
                                <!-- {{ errorNode?.guid }} : {{ item?.guid }} -->
                                <a-dropdown
                                    :trigger="['click']"
                                    @click.stop="() => {}"
                                >
                                    <div class="pl-2" v-if="hasWritePermission">
                                        <AtlanIcon
                                            icon="KebabMenu"
                                            class="w-4 h-4 my-auto"
                                        ></AtlanIcon>
                                    </div>
                                    <template #overlay>
                                        <a-menu>
                                            <!-- RENAME FOLDER PERMISSIONS -->
                                            <a-menu-item
                                                key="rename"
                                                @click="renameFolder"
                                                >Rename folder</a-menu-item
                                            >
                                            <a-menu-item
                                                key="newQuery"
                                                @click="newQuery"
                                                >New query</a-menu-item
                                            >
                                            <!-- <a-menu-item
                                                key="public"
                                                @click="
                                                    showPublishPopover = true
                                                "
                                                >Make folder public</a-menu-item
                                            > -->

                                            <a-menu-item
                                                key="ChangeFolder"
                                                @click="
                                                    showFolderPopover = true
                                                "
                                                >Move folder</a-menu-item
                                            >
                                            <!-- DELETE FOLDER PERMISSIONS -->
                                            <a-menu-item
                                                key="deleteFolder"
                                                class="text-red-600"
                                                @click="
                                                    showDeletePopover = true
                                                "
                                                >Delete folder</a-menu-item
                                            >
                                        </a-menu>
                                        <!-- --------------------- -->
                                    </template>
                                </a-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <!--Empty NODE -->
                <div
                    v-else-if="item.typeName === 'Empty'"
                    class="h-8 text-sm font-bold text-gray-500"
                >
                    {{ item.title }}
                </div>
                <!------------------------------->
                <!-- Popover Allowed -->
                <PopoverAsset
                    :item="item"
                    placement="right"
                    v-else-if="item.typeName === 'Query'"
                >
                    <template #extraHeaders>
                        <div
                            class="w-1 h-1 mx-2 rounded-full -mt-0.5"
                            style="background-color: #c4c4c4"
                        ></div>
                        <div class="flex items-center h-full">
                            <div
                                class="relative w-4 h-4 mb-0.5 mr-1 overflow-hidden"
                            >
                                <AtlanIcon icon="FolderClosed" class="h-6" />
                            </div>

                            <span>{{ item?.parentTitle }}</span>
                        </div>
                    </template>

                    <template #button>
                        <!-- <a-button class="mt-3" @click="openSidebar" block>
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
                            @click="openSidebar"
                        >
                            <span class="text-primary whitespace-nowrap">
                                Show Preview</span
                            >
                            <AtlanIcon icon="ArrowRight" class="text-primary" />
                        </AtlanBtn>
                    </template>
                    <div
                        class="relative flex content-center w-full h-8 my-auto overflow-hidden text-sm leading-5 text-gray-700"
                    >
                        <div class="parent-ellipsis-container py-1.5">
                            <AtlanIcon
                                :icon="
                                    getEntityStatusIcon(
                                        'query',
                                        certificateStatus(item)
                                    )
                                "
                                class="w-4 h-4 my-auto mr-1"
                                color="#5277D7"
                            ></AtlanIcon>
                            <span
                                class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                                >{{ title(item) }}</span
                            >

                            <div
                                class="absolute flex items-center h-full text-gray-500 transition duration-300 opacity-0 margin-align-top group-hover:opacity-100"
                                :class="[
                                    item?.selected
                                        ? 'bg-gradient-to-l from-tree-light-color  via-tree-light-color '
                                        : 'bg-gradient-to-l from-gray-light via-gray-light',

                                    hasWritePermission ? 'right-6' : 'right-0',
                                ]"
                            >
                                <div
                                    :data-test-id="'run-saved-query'"
                                    class="ml-24"
                                    @click="() => actionClick('play', item)"
                                >
                                    <a-tooltip color="#363636" placement="top">
                                        <template #title>Run Query</template>

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
                                    class="pl-2"
                                    @click.stop="
                                        () => actionClick('info', item)
                                    "
                                    :data-test-id="'insert-in-editor'"
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
                            </div>
                            <div
                                class="absolute top-0 right-0 flex items-center h-full text-gray-500 transition duration-300 opacity-0 margin-align-top group-hover:opacity-100"
                            >
                                <a-dropdown
                                    :trigger="['click']"
                                    @click.stop="() => {}"
                                >
                                    <div class="pl-2" v-if="hasWritePermission">
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
                                                >Rename query</a-menu-item
                                            >

                                            <a-menu-item
                                                key="ChangeFolder"
                                                @click="
                                                    showFolderPopover = true
                                                "
                                                >Move query</a-menu-item
                                            >
                                            <div
                                                v-if="activeInlineTab?.queryId"
                                                class="text-gray-700"
                                            >
                                                <a-sub-menu
                                                    key="shareQuery"
                                                    style="min-width: 200px"
                                                >
                                                    <template #title>
                                                        <div
                                                            class="flex items-center justify-between w-full mr-2"
                                                        >
                                                            <div
                                                                class="flex items-center justify-between w-full text-gray-500"
                                                            >
                                                                <span
                                                                    class="text-gray-700"
                                                                    >Share
                                                                    query</span
                                                                >
                                                            </div>
                                                            <AtlanIcon
                                                                icon="ChevronRight"
                                                                class="ml-2 text-gray-500 -mt-0.5"
                                                            />
                                                        </div>
                                                    </template>
                                                    <template #expandIcon />
                                                    <div
                                                        class="text-gray-700"
                                                        style="min-width: 200px"
                                                    >
                                                        <a-menu-item
                                                            key="copyLink"
                                                            class="px-4 py-2 text-sm"
                                                            @click="copyURL"
                                                        >
                                                            <div
                                                                class="flex items-center justify-between"
                                                            >
                                                                <span
                                                                    >Copy
                                                                    Link</span
                                                                >
                                                            </div>
                                                        </a-menu-item>
                                                    </div>
                                                </a-sub-menu>
                                            </div>
                                            <a-menu-item
                                                key="deleteFolder"
                                                class="text-red-600"
                                                @click="
                                                    showDeletePopover = true
                                                "
                                                >Delete query</a-menu-item
                                            >
                                        </a-menu>
                                    </template>
                                </a-dropdown>
                            </div>
                        </div>
                    </div>
                </PopoverAsset>
            </div>
        </div>
    </div>
    <a-popover :visible="showDeletePopover" placement="rightTop">
        <template #content>
            <TreeDeletePopover
                :item="item"
                @cancel="showDeletePopover = false"
                @delete="() => delteItem(item?.typeName)"
                :isSaving="isDeleteLoading"
            />
        </template>
    </a-popover>
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

    <a-popover :visible="showFolderPopover" placement="rightTop">
        <template #content>
            <div>
                <QueryFolderSelector
                    :connector="currentConnector"
                    :savedQueryType="savedQueryType"
                    @folderChange="getSelectedFolder"
                    :selectedNewFolder="item"
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
                        @click="changeFolder(item)"
                        :loading="isUpdating"
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

    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { useAccess } from '~/components/insights/common/composables/useAccess'
    import PopoverAsset from '~/components/common/popover/assets/index.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import TreeDeletePopover from '~/components/insights/common/treeDeletePopover.vue'
    import PublishFolderPopover from '~/components/insights/common/publishFolderPopover.vue'
    import QueryFolderSelector from './queryFolderSelector2.vue'

    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { assetInterface } from '~/types/assets/asset.interface'

    // import { Classification } from '~/api/atlas/classification'
    import { ATLAN_PUBLIC_QUERY_CLASSIFICATION } from '~/components/insights/common/constants'
    import { Insights } from '~/services/meta/insights/index'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useRoute, useRouter } from 'vue-router'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import AtlanBtn from '@/UI/button.vue'
    import { copyToClipboard } from '~/utils/clipboard'

    const {
        inlineTabRemove,
        modifyActiveInlineTabEditor,
        modifyActiveInlineTab,
    } = useInlineTab()
    const { focusEditor, setSelection } = useEditor()

    import { message } from 'ant-design-vue'

    export default defineComponent({
        components: {
            StatusBadge,
            TreeDeletePopover,
            PublishFolderPopover,
            QueryFolderSelector,
            PopoverAsset,
            AtlanBtn,
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
        setup(props) {
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

            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const editorInstanceRef = inject('editorInstance') as Ref<any>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const toggleCreateQueryModal = inject<(guid: string) => void>(
                'toggleCreateQueryModal'
            )
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

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const { openSavedQueryInNewTabAndRun } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )

            const { isSameNodeOpenedInSidebar } = useSchema()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )
            const showDeletePopover = ref(false)
            const showPublishPopover = ref(false)
            const showFolderPopover = ref(false)

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
                                Object.assign({}, activeInlineTab.value)

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
                            monacoInstance
                        )
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

            const getData = (activeInlineTab, dataList, columnList) => {
                if (activeInlineTab && inlineTabs?.value) {
                    const activeInlineTabCopy: activeInlineTabInterface =
                        JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                    activeInlineTabCopy.playground.editor.dataList = dataList

                    activeInlineTabCopy.playground.editor.columnList =
                        columnList
                    const saveQueryDataInLocalStorage = false
                    // modifyActiveInlineTabEditor(
                    //     activeInlineTabCopy,
                    //     inlineTabs,
                    //     saveQueryDataInLocalStorage
                    // )

                    modifyActiveInlineTab(
                        activeInlineTabCopy,
                        inlineTabs,
                        activeInlineTabCopy.isSaved,
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
                if (toggleCreateQueryModal) {
                    toggleCreateQueryModal(item)
                }
            }
            const publishFolder = () => {
                // const payload = ref([
                //     {
                //         entityGuid: props.item.guid as string,
                //         attributes: {},
                //         propagate: true,
                //         removePropagationsOnEntityDelete: true,
                //         typeName: ATLAN_PUBLIC_QUERY_CLASSIFICATION,
                //         validityPeriods: [],
                //     },
                // ])
                // const { error, isLoading } = Classification.linkClassification({
                //     cache: undefined,
                //     payload,
                //     entityGuid: props.item.guid,
                // })
                // watch([isLoading], () => {
                //     if (isLoading.value == false && !error.value) {
                //         message.success({
                //             content: `${item.value?.attributes?.name} was made public!`,
                //         })
                //         refetchParentNode(props.item.guid, 'Folder')
                //     }
                // })
            }
            const renameFolder = () => {
                const orignalName = item.value.attributes.name
                const parentNode = document.getElementsByClassName(
                    `${item.value.qualifiedName}`
                )[0]

                const childNode = parentNode?.firstChild as HTMLElement
                childNode?.classList?.add('hidden')

                const input = document.createElement('input')
                input.setAttribute(
                    'class',
                    `outline-none py-0 px-1 rounded mx-0 my-0.5 w-full`
                )
                input.classList.add(`${item.value.qualifiedName}-rename-input`)

                let div = document.createElement('div')
                div.classList.add('flex', 'items-center', 'active-input', 'h-8')

                let folderCloseSvg =
                    '<span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.49951 2H3.49951C2.94723 2 2.49951 2.44772 2.49951 3V11.5C2.49951 12.0523 2.94723 12.5 3.49951 12.5H11.4995C12.0518 12.5 12.4995 12.0523 12.4995 11.5V5C12.4995 4.44772 12.0518 4 11.4995 4H7.49951C6.94723 4 6.49951 3.55228 6.49951 3C6.49951 2.44772 6.0518 2 5.49951 2Z" fill="white" stroke="#5277D7"/><path d="M13.3266 6H2.61167C2.01741 6 1.55428 6.51516 1.61731 7.10607L2.20398 12.6061C2.2582 13.1144 2.68711 13.5 3.19833 13.5H12.4466C12.9379 13.5 13.3564 13.1431 13.4341 12.658L14.3141 7.15799C14.4113 6.55041 13.9419 6 13.3266 6Z" fill="white" stroke="#5277D7"/></svg></span>'

                let folderOpenSvg =
                    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.49951 2H3.49951C2.94723 2 2.49951 2.44771 2.49951 3V12.3C2.49951 12.8523 2.94723 13.3 3.49951 13.3H11.4995C12.0518 13.3 12.4995 12.8523 12.4995 12.3V5C12.4995 4.44772 12.0518 4 11.4995 4H7.49951C6.94723 4 6.49951 3.55228 6.49951 3C6.49951 2.44772 6.0518 2 5.49951 2Z" fill="white" stroke="#5277D7"/><path d="M14.3433 7H5.48612C5.07234 7 4.7013 7.25483 4.55277 7.64102L2.822 12.141C2.57008 12.796 3.05357 13.5 3.75535 13.5H12.6125C13.0263 13.5 13.3973 13.2452 13.5459 12.859L15.2766 8.35898C15.5286 7.70398 15.0451 7 14.3433 7Z" fill="white" stroke="#5277D7"/></svg>'

                let folderSvg = expandedKeys.value.find(
                    (key) => key === item.value.key
                )
                    ? folderOpenSvg
                    : folderCloseSvg
                let querySvg =
                    '<span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="#5277D7"/><path d="M4 6L6 8L4 10" stroke="#5277D7" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 11H12" stroke="#5277D7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'

                const folderSvgEl = new DOMParser().parseFromString(
                    item.value.typeName === 'Query' ? querySvg : folderSvg,
                    'text/html'
                ).body.firstElementChild

                div.append(folderSvgEl)
                div.append(input)
                parentNode?.prepend(div)
                input.focus()
                input.value = ''
                input.value = item.value.attributes?.name

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        parentNode?.removeChild(div)
                        childNode?.classList?.remove('hidden')
                    }
                    if (e.key === 'Enter') {
                        if (input.value && input.value !== orignalName) {
                            item.value.attributes.name = input.value
                            const { data, error } = Insights.CreateQueryFolder(
                                {
                                    entity: item.value.entity,
                                },
                                {}
                            )
                            console.log('rename: ', { data, error })
                            watch(
                                error,
                                () => {
                                    console.log('rename error: ', error)
                                    if (error.value == undefined) {
                                        message.success({
                                            content: `${
                                                item.value.typeName === 'Query'
                                                    ? 'Query'
                                                    : 'Folder'
                                            } renamed successfully`,
                                        })
                                        useAddEvent(
                                            'insights',
                                            'folder',
                                            'renamed',
                                            undefined
                                        )
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
                                },
                                { immediate: true }
                            )
                        }
                        input.value = ''
                        try {
                            parentNode?.removeChild(div)
                        } catch {}
                        childNode?.classList?.remove('hidden')
                    }
                })
                input.addEventListener('blur', (e) => {
                    if (input.value && input.value !== orignalName) {
                        item.value.attributes.name = input.value
                        const { data, error } = Insights.CreateQueryFolder(
                            {
                                entiy: item.value.entity,
                            },
                            {}
                        )
                        // watch(error, (newError) => {
                        //     if (newError) {
                        //         item.value.attributes.name = orignalName
                        //     }
                        // })
                        watch(
                            error,
                            () => {
                                console.log('rename erro: ', error)
                                if (error.value == undefined) {
                                    message.success({
                                        content: `${
                                            item.value.typeName === 'Query'
                                                ? 'Query'
                                                : 'Folder'
                                        } renamed successfully`,
                                    })
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
                            },
                            { immediate: true }
                        )
                    }
                    try {
                        parentNode?.removeChild(div)
                    } catch {}
                    childNode?.classList?.remove('hidden')
                })
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
                let key = item.value.guid
                let parentGuid = item?.value?.attributes?.parent?.guid
                console.log('delete item: ', item)
                const { data, error, isLoading } = Insights.DeleteEntity(
                    item.value.guid,
                    {}
                )
                isDeleteLoading.value = true

                watch([data, error, isLoading], ([newData, newError]) => {
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

                        setTimeout(() => {
                            refetchNode(
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

            let selectedFolder = ref(null)

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
                console.log('item to move: ', item)
                let previousParentGuId = item.attributes.parent.guid
                let selectedParentGuid = selectedFolder?.value?.guid

                // console.log('entity item parent: ', previousParentGuId)
                // console.log('entity selected folder: ', selectedParentGuid)

                console.log('selected folder:', selectedFolder.value)

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

                    console.log('new entity: ', newEntity)

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
                                } else {
                                    message.success(`Query move failed`)
                                }
                            }
                            showFolderPopover.value = false
                            showPublishPopover.value = false
                        })
                    }
                }
            }

            const openSidebar = () => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                activeInlineTabCopy.assetSidebar.assetInfo = item.value
                activeInlineTabCopy.assetSidebar.isVisible = true
                openAssetSidebar(activeInlineTabCopy, 'not_editor')
            }

            const copyURL = () => {
                const URL =
                    window.location.host +
                    window.location.pathname +
                    `?id=` +
                    item?.value?.guid
                copyToClipboard(URL)
                message.success('Link Copied!')
                useAddEvent('insights', 'query', 'link_copied', undefined)
            }

            return {
                evaluatePermisson,
                permissions,
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
