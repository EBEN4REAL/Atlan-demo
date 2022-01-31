<template>
    <a-dropdown
        trigger="hover"
        placement="bottomLeft"
        :visible="dropdownVisible"
    >
        <AtlanBtn
            class="folderBtn"
            size="sm"
            color="secondary"
            padding="compact"
            @click="toggleDropdown"
        >
            <AtlanIcon
                icon="CollectionIconSmall"
                class="w-4 h-4"
                v-if="
                    selectedFolderContext?.typeName === 'Collection' ||
                    Object.keys(selectedFolderContext)?.length === 0
                "
            ></AtlanIcon>
            <AtlanIcon icon="FolderClosed" v-else></AtlanIcon>

            <span class="flex pl-0.5 text-xs text-gray-500 truncate mt-0.5">
                {{ selectedFolder ? selectedFolder : 'Collection' }}
            </span>
        </AtlanBtn>

        <template #overlay>
            <div
                ref="clickOutside"
                class="overflow-y-scroll rounded-sm popover-container"
            >
                <div
                    class="w-full h-full"
                    v-if="writeAccessCollections?.length"
                >
                    <div
                        class="absolute top-0 left-0 z-10 flex items-center justify-between w-full px-4 pt-3 pb-2 bg-white"
                    >
                        <span class="text-sm font-bold text-gray-700"
                            >Save query to</span
                        >
                        <a-tooltip placement="right" color="#363636">
                            <template #title> Add folder </template>

                            <AtlanIcon
                                color="#5277D7"
                                icon="NewFolder"
                                class="h-4 outline-none cursor-pointer hover:text-primary"
                                @click="createFolderInput"
                            />
                        </a-tooltip>
                    </div>

                    <div class="mt-10 mb-32 overflow-x-hidden">
                        <div
                            v-for="collection in finalCollectionList"
                            :key="collection?.guid"
                        >
                            <div
                                class="flex items-center justify-between w-full h-8 px-4"
                                :class="`${
                                    selectedFolderContext?.guid ===
                                    collection?.guid
                                        ? 'bg-primary-light'
                                        : 'bg-white hover:bg-gray-100'
                                }`"
                            >
                                <div
                                    @click="onSelect(collection, 'root')"
                                    class="flex items-center w-11/12 cursor-pointer parent-ellipsis-container"
                                >
                                    <AtlanIcon
                                        :icon="
                                            treeSelectedCollection?.guid ===
                                            collection?.guid
                                                ? 'CaretDown'
                                                : 'CaretRight'
                                        "
                                        class="w-4 h-4 my-auto outline-none cursor-pointer parent-ellipsis-container-extension"
                                        @click.stop="
                                            expandCollection(collection, $event)
                                        "
                                    ></AtlanIcon>
                                    <AtlanIcon
                                        icon="CollectionIconSmall"
                                        class="w-4 h-4 my-auto mr-2 parent-ellipsis-container-extension"
                                    ></AtlanIcon>
                                    <span
                                        class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                                        >{{ collection?.attributes.name }}</span
                                    >
                                </div>

                                <AtlanIcon
                                    v-if="
                                        selectedFolderContext?.guid ===
                                        collection?.guid
                                    "
                                    icon="Check"
                                    class="w-4 h-4 text-primary parent-ellipsis-container-extension"
                                />
                            </div>
                            <div
                                class="w-full h-full ml-1 overflow-y-scroll bg-white"
                                v-if="
                                    treeSelectedCollection?.guid ===
                                    collection?.guid
                                "
                            >
                                <query-tree-list
                                    @createFolderInput="createFolderInput"
                                    :savedQueryType="savedQueryType2"
                                    :tree-data="newTreeData"
                                    :on-load-data="onLoadData"
                                    :select-node="onSelect"
                                    :expand-node="expandNode"
                                    :is-loading="isInitingTree"
                                    :loaded-keys="loadedKeys"
                                    :selected-keys="selectedKey"
                                    :expanded-keys="expandedKeys"
                                    v-if="newTreeData.length"
                                    :selectedNewFolder="selectedFolderContext"
                                    :id="`${collection?.attributes?.qualifiedName}-selector`"
                                />

                                <div
                                    class="flex flex-col justify-center h-8"
                                    :id="`${collection?.attributes?.qualifiedName}-selector`"
                                >
                                    <a-spin
                                        v-if="isQueriesLoading"
                                        size="small"
                                    />
                                </div>
                            </div>
                            <div
                                v-else
                                class="flex flex-col justify-center"
                                :id="`${collection?.attributes?.qualifiedName}-selector`"
                            ></div>
                        </div>
                    </div>

                    <div class="absolute bottom-0 left-0 z-10 bg-white">
                        <div
                            v-if="readAccessCollections.length"
                            class="flex p-2 mx-4 text-xs text-gray-500 bg-gray-100 rounded item-center"
                        >
                            <AtlanIcon
                                icon="Info"
                                class="w-4 h-4 mt-1.5 mr-2 text-primary parent-ellipsis-container-extension"
                            />
                            <div>
                                Only collections you have access to are shown.
                            </div>
                        </div>

                        <div class="flex mt-3 mb-4 ml-4">
                            <AtlanBtn
                                size="sm"
                                color="secondary"
                                padding="compact"
                                class="h-6 py-1 text-center border-none cursor-pointer hover:text-primary"
                                style="width: 102px"
                                @click="closeDropdown('cancel')"
                            >
                                <span>Cancel</span>
                            </AtlanBtn>

                            <AtlanBtn
                                size="sm"
                                color="primary"
                                padding="compact"
                                class="h-6 py-1 ml-3 text-center text-white border-none cursor-pointer"
                                style="width: 102px"
                                @click="closeDropdown('save')"
                            >
                                <span class="text-center">Save</span>
                            </AtlanBtn>
                        </div>
                    </div>
                </div>
                <div
                    class="h-full pt-0 pb-4 mx-5 overflow-y-hidden w-9/11"
                    v-else
                >
                    <EmptyView
                        empty-screen="EmptyCollections"
                        headline="Collections"
                        desc="Organise queries relevant for your project or team into collections and  share it with others. "
                        button-text="Create Collection"
                        @event="toggleCollectionModal"
                    />
                </div>
            </div>
        </template>
    </a-dropdown>
    <CreateCollectionModal
        v-if="showCollectionModal"
        v-model:showCollectionModal="showCollectionModal"
        :is-create="true"
    />
</template>

<script lang="ts">
    import {
        defineComponent,
        toRefs,
        ref,
        watch,
        reactive,
        PropType,
        Ref,
        // onBeforeMount,
        // Vue,
        inject,
        ComputedRef,
        computed,
        onMounted,
    } from 'vue'

    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    import QueryTreeList from './queryTreeList.vue'
    import useQueryTree from './composables/useQueryTree'
    import { useRouter, useRoute } from 'vue-router'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import AtlanBtn from '@/UI/button.vue'
    import EmptyView from '@common/empty/index.vue'
    import CreateCollectionModal from '~/components/insights/explorers/queries/collection/createCollectionModal.vue'
    // import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import {
        Folder,
        QueryCollection,
    } from '~/types/insights/savedQuery.interface'

    import { onClickOutside } from '@vueuse/core'
    // import { colSize } from 'ant-design-vue/lib/grid/Col'

    export default defineComponent({
        name: 'QueryFolderSelector',
        components: {
            QueryTreeList,
            AtlanBtn,
            CreateCollectionModal,
            EmptyView,
        },
        props: {
            parentFolder: {
                type: Object,
                required: false,
            },
            connector: {
                type: String as PropType<string | undefined>,
                required: true,
                default: '',
            },
            savedQueryType: {
                type: Object as PropType<object>,
                required: true,
            },
        },
        emits: ['folderChange'],
        setup(props, { emit }) {
            const route = useRoute()
            const permissions = inject('permissions') as ComputedRef<any>
            const router = useRouter()
            const { connector, savedQueryType, parentFolder } = toRefs(props)

            const savedQueryType2: Ref<object> = ref(savedQueryType.value)
            const queryFolderNamespace = inject<Ref<Folder>>(
                'queryFolderNamespace',
                ref({}) as Ref<Folder>
            )
            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >

            const readAccessCollections = inject(
                'readAccessCollections'
            ) as ComputedRef<QueryCollection[] | undefined>

            const writeAccessCollections = inject(
                'writeAccessCollections'
            ) as ComputedRef<QueryCollection[] | undefined>

            // const finalCollectionList =

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const selectedFolder = ref()
            const selectedKey = ref<string[]>([])
            let dropdownVisible = ref(false)
            let selectedFolderContext = ref({})
            const selectedCollection = computed(() => {
                const collection = writeAccessCollections.value?.find(
                    (coll) =>
                        coll.attributes.qualifiedName ===
                        activeInlineTab.value.explorer.queries.collection
                            .qualifiedName
                )
                return collection
            })

            let treeSelectedCollection = ref(selectedCollection.value)

            const finalCollectionList = computed(() => {
                const collections = writeAccessCollections.value.filter(
                    (col) => col.guid !== selectedCollection.value?.guid
                )

                if (selectedCollection.value) {
                    return [selectedCollection.value, ...collections]
                } else return collections
            })

            const refreshQueryTree = inject<
                (guid: string, type: 'query' | 'Folder') => void
            >('refreshQueryTree', () => {})

            // console.log('already selected: ', props.selectedFolderQF)
            // console.log('already selected: ', parentFolder)

            let previousContext = ref(selectedFolderContext.value)

            watch(
                parentFolder,
                () => {
                    let item = parentFolder.value
                    // console.log('parent folder 1: ', parentFolder.value)

                    if (item?.typeName === 'Folder') {
                        selectedKey.value = [item.guid]
                        selectedFolder.value = item.title
                        dropdownVisible.value = false

                        selectedFolderContext.value = {
                            ...parentFolder.value,
                        }

                        emit('folderChange', {
                            dataRef: parentFolder.value,
                        })
                    }
                },
                { immediate: true }
            )

            const expandCollection = (selected, event) => {
                // console.log('event: ', event)
                if (selected?.guid === treeSelectedCollection?.value?.guid) {
                    treeSelectedCollection.value = {}
                } else {
                    treeSelectedCollection.value = selected
                }
            }

            const onSelect = (selected: any, event: any) => {
                if (event === 'root') {
                    treeSelectedCollection.value = selected

                    let rootData = selected

                    const data = {
                        dataRef: {
                            ...rootData,
                        },
                    }

                    selectedKey.value = [selected?.guid]
                    selectedFolder.value = selected?.displayText
                    // dropdownVisible.value = false
                    selectedFolderContext.value = {
                        ...rootData,
                    }

                    emit('folderChange', data)
                } else {
                    const item = event.node.dataRef.entity
                    console.log('folder: ', event.node.dataRef)

                    if (item.typeName === 'Folder') {
                        selectedKey.value = [item.guid]
                        selectedFolder.value = event?.node?.dataRef?.title
                            ? event?.node?.dataRef?.title
                            : event?.node?.dataRef?.entity?.displayText
                        // dropdownVisible.value = false
                    }
                    console.log('folder: ', event.node)

                    selectedFolderContext.value = {
                        ...item,
                    }

                    emit('folderChange', {
                        dataRef: event.node,
                    })
                }
            }

            const toggleDropdown = () => {
                previousContext.value = {
                    ...selectedFolderContext.value,
                }

                // console.log('data: ', previousContext.value)
                dropdownVisible.value = !dropdownVisible.value
            }

            const closeDropdown = (action) => {
                // console.log('close: ', {
                //     action,
                //     previousContext: previousContext.value,
                // })

                if (action === 'cancel') {
                    console.log(
                        'previousContext.value: ',
                        previousContext.value
                    )
                    if (previousContext?.value?.guid) {
                        if (previousContext.value?.typeName === 'Collection') {
                            onSelect(previousContext.value, 'root')
                        } else {
                            let data = {
                                node: {
                                    dataRef: {
                                        entity: previousContext.value,
                                    },
                                    entity: previousContext.value,
                                    attributes:
                                        previousContext.value.attributes,
                                    typeName: previousContext.value.typeName,
                                    title: previousContext.value.displayText,
                                    qualifiedName:
                                        previousContext.value.attributes
                                            .qualifiedName,
                                    guid: previousContext.value.guid,
                                    key: previousContext.value.guid,
                                },
                            }
                            onSelect(previousContext.value, data)
                        }
                    } else {
                        onSelect(previousContext.value, 'root')
                    }

                    // emit('folderChange', { dataRef: previousContext.value })
                } else {
                }
                dropdownVisible.value = false
            }
            const showDropdown = () => {
                dropdownVisible.value = true
            }

            const pushGuidToURL = (item) => {
                // const queryParams = { id: guid }
                // if (route?.query?.vqb) queryParams.vqb = true

                const queryParams = {}
                if (item.guid) queryParams.id = item.guid
                if (item?.attributes?.isVisualQuery) queryParams.vqb = true

                router.push({ path: `insights`, query: queryParams })
            }

            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

            const { openSavedQueryInNewTab, createFolder } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )

            const newFolderName = ref('')
            const newFolderCreateable = ref(true)
            let showEmptyState = ref(true)

            const {
                treeData: treeData,
                loadedKeys: loadedKeys,
                isInitingTree: isInitingTree,
                // selectedKeys: selectedKeys,
                expandedKeys: expandedKeys,
                immediateParentFolderQF: immediateParentFolderQF,
                onLoadFolderData: onLoadData,
                expandNode: expandNode,
                selectNode: selectNode,
                refetchNode: refetchNode,
                immediateParentGuid: immediateParentGuid,
                nodeToParentKeyMap: nodeToParentKeyMap,
                currentSelectedNode: currentSelectedNode,
                isLoading: isQueriesLoading,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                queryFolderNamespace,
                permissions: {
                    readQueries: permissions.value.public.readQueries,
                    readFolders: permissions.value.public.readFolders,
                },
                collection: treeSelectedCollection,
            })

            const newTreeData = computed(() => {
                let data = treeData?.value?.filter(
                    (el) => el.typeName !== 'Query'
                )
                // console.log('new tree: ', data)
                return data
            })

            onMounted(() => {
                if (!parentFolder.value || !parentFolder.value.guid) {
                    onSelect(selectedCollection.value, 'root')
                }
            })

            const showCollectionModal = ref(false)
            const toggleCollectionModal = () => {
                dropdownVisible.value = false

                showCollectionModal.value = !showCollectionModal.value
            }

            let saveFolderLoading = ref(false)
            let folderCreated = ref(false)

            const createFolderInput = () => {
                if (selectedFolderContext?.value?.guid) {
                    const inputClassName = `${selectedFolderContext.value?.guid}_folder_input`

                    const existingInputs =
                        document.getElementsByClassName(inputClassName)

                    let parentGuid = ref(selectedFolderContext?.value?.guid)
                    let parentQualifiedName = ref(
                        selectedFolderContext?.value?.attributes?.qualifiedName
                    )

                    const appendInput = () => {
                        folderCreated.value = true
                        if (
                            !existingInputs.length &&
                            newFolderCreateable.value
                        ) {
                            let parentFolder

                            if (
                                selectedFolderContext.value.typeName ===
                                'Collection'
                            ) {
                                parentFolder = document.getElementById(
                                    `${parentQualifiedName.value}-selector`
                                )
                            } else {
                                // parentFolder = document.getElementById(
                                //     `${parentQualifiedName.value}-selector`
                                // ).parentNode?.parentNode?.parentNode

                                parentFolder = document.querySelector(
                                    'div.ant-tree-list .ant-tree-treenode-selected'
                                )
                            }

                            let ul = document.createElement('div')
                            const div = document.createElement('div')

                            showEmptyState.value = false

                            div.classList.add(
                                'flex',
                                'items-center',
                                'active-input',
                                'h-8'
                            )

                            let childCount = 0
                            if (
                                selectedFolderContext?.value?.typeName !==
                                'Collection'
                            ) {
                                childCount =
                                    parentFolder.children[0].children.length + 1

                                // console.log('count: ', childCount)
                            }

                            let spaceEl = null

                            if (childCount) {
                                let space = `<span style="padding-left:${
                                    24 * childCount
                                }px;" class="h-2"></span>`
                                spaceEl = new DOMParser().parseFromString(
                                    space,
                                    'text/html'
                                ).body.firstElementChild
                            }

                            let caret

                            if (
                                selectedFolderContext.value?.typeName ===
                                'Collection'
                            ) {
                                caret =
                                    '<span class="mt-2 ml-2 ant-tree-switcher ant-tree-switcher_close"><svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-auto ant-tree-switcher-icon" data-v-b3169684="" style="height: 1rem;"><path d="m6 4 3.646 3.646a.5.5 0 0 1 0 .708L6 12" stroke="#6F7590" stroke-linecap="round"></path></svg></span>'
                            } else {
                                caret =
                                    '<span class="mt-0.5 ml-2 ant-tree-switcher ant-tree-switcher_close"><svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-auto ant-tree-switcher-icon" data-v-b3169684="" style="height: 1rem;"><path d="m6 4 3.646 3.646a.5.5 0 0 1 0 .708L6 12" stroke="#6F7590" stroke-linecap="round"></path></svg></span>'
                            }
                            const caretEl = new DOMParser().parseFromString(
                                caret,
                                'text/html'
                            ).body.firstElementChild

                            let folderSvg =
                                '<span class="w-4 h-4 mr-1  mb-0.5"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"  data-v-a0c5611e="" style="height: 1rem;"><path d="M5.5 2h-2a1 1 0 0 0-1 1v8.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-4a1 1 0 0 1-1-1 1 1 0 0 0-1-1Z" fill="#fff" stroke="#5277D7"></path><path d="M13.327 6H2.612a1 1 0 0 0-.995 1.106l.587 5.5a1 1 0 0 0 .994.894h9.249a1 1 0 0 0 .987-.842l.88-5.5A1 1 0 0 0 13.327 6Z" fill="#fff" stroke="#5277D7"></path></svg></span>'

                            const folderSvgEl = new DOMParser().parseFromString(
                                folderSvg,
                                'text/html'
                            ).body.firstElementChild

                            let space1 = `<span style="padding-left:16px;" class="h-2"></span>`
                            let space = new DOMParser().parseFromString(
                                space1,
                                'text/html'
                            ).body.firstElementChild

                            div.appendChild(space)
                            if (spaceEl) {
                                div.appendChild(spaceEl)
                            }

                            // div.appendChild(spaceEl)
                            div.appendChild(caretEl)
                            div.appendChild(folderSvgEl)

                            const input = document.createElement('input')

                            const makeCreateFolderRequest = () => {
                                const { data } = createFolder(
                                    newFolderName.value,
                                    saveFolderLoading,
                                    '',
                                    parentQualifiedName,
                                    parentGuid,
                                    selectedFolderContext
                                )
                                watch(data, async (newData) => {
                                    if (newData) {
                                        newFolderName.value = ''
                                        setTimeout(async () => {
                                            await refetchNode(
                                                parentGuid.value,
                                                'Folder'
                                            )
                                            ul.removeChild(div)
                                        }, 1000)

                                        //refetch tree
                                        setTimeout(async () => {
                                            await refreshQueryTree(
                                                parentGuid.value,
                                                'Folder'
                                            )
                                            folderCreated.value = false
                                        }, 1500)

                                        if (
                                            selectedFolderContext?.value
                                                ?.typeName === 'Collection' &&
                                            selectedFolderContext?.value
                                                ?.guid !==
                                                treeSelectedCollection.value
                                                    ?.guid
                                        ) {
                                            treeSelectedCollection.value =
                                                selectedFolderContext?.value
                                        }
                                    }
                                })
                            }

                            input.setAttribute(
                                'class',
                                `outline-none py-0 rounded my-1 w-full ${inputClassName}`
                            )
                            input.setAttribute(
                                'placeholder',
                                'Name your folder'
                            )
                            input.addEventListener('input', (e) => {
                                newFolderName.value = e.target?.value
                            })

                            input.addEventListener('keydown', (e) => {
                                if (e.key === 'Escape') {
                                    newFolderName.value = ''
                                    ul.removeChild(div)
                                    // removeInputBox()
                                    showEmptyState.value = true
                                    folderCreated.value = false
                                }
                                if (e.key === 'Enter') {
                                    // create folder request
                                    if (newFolderName.value.length) {
                                        makeCreateFolderRequest()
                                        newFolderName.value = ''
                                        showEmptyState.value = false
                                    } else {
                                        newFolderName.value = ''
                                        ul.removeChild(div)
                                        showEmptyState.value = true
                                        folderCreated.value = false
                                        // removeInputBox()
                                    }
                                }
                            })
                            input.addEventListener('blur', (e) => {
                                if (newFolderName.value.length) {
                                    makeCreateFolderRequest()
                                    showEmptyState.value = false
                                } else {
                                    div.removeChild(input)
                                    div.setAttribute('class', 'hidden')
                                    // removeInputBox()
                                    newFolderName.value = ''
                                    newFolderCreateable.value = false
                                    setTimeout(() => {
                                        newFolderCreateable.value = true
                                        showEmptyState.value = true
                                        folderCreated.value = false
                                    }, 300)
                                }
                            })

                            div.appendChild(input)
                            ul.appendChild(div)
                            // parentFolder?.append(ul)
                            // parentFolder?.insertBefore(ul, parentFolder?.firstChild)
                            if (
                                selectedFolderContext.value.typeName ===
                                'Collection'
                            ) {
                                parentFolder.prepend(ul)
                                // console.log('input parent append')
                            } else {
                                parentFolder.parentNode.insertBefore(
                                    ul,
                                    parentFolder.nextSibling
                                )
                            }
                            input.focus()
                        }
                    }

                    appendInput()
                }

                // if the folder is not loaded, don't do anything
            }

            const clickOutside = ref(null)
            onClickOutside(clickOutside, (event) => {
                if (dropdownVisible.value) {
                    closeDropdown('cancel')
                }
            })

            return {
                clickOutside,
                onSelect,
                selectedFolder,
                savedQueryType2,
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKey,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
                refetchNode,
                immediateParentFolderQF,
                immediateParentGuid,
                nodeToParentKeyMap,
                toggleDropdown,
                dropdownVisible,
                closeDropdown,
                showDropdown,
                currentSelectedNode,
                selectedFolderContext,
                queryFolderNamespace,
                selectedCollection,
                treeSelectedCollection,
                newTreeData,
                queryCollections,
                writeAccessCollections,
                showCollectionModal,
                toggleCollectionModal,
                createFolderInput,
                expandCollection,
                isQueriesLoading,
                readAccessCollections,
                finalCollectionList,
                folderCreated,
            }
        },
    })
</script>
<style lang="less" module>
    .dropdown {
        :global(.ant-dropdown-content) {
            border-radius: 4px !important;
        }
    }
</style>

<style lang="less" scoped>
    .popover-container {
        width: 300px;
        max-height: 500px;

        background: #ffffff;

        box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        // overflow-y: scroll;
        padding: 0px !important;
    }
    .folderBtn {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 8px !important;

        min-width: 71px !important;
        height: 22px !important;

        box-sizing: border-box !important;
        border-radius: 4px !important;
    }
    .tab-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 12px 16px 1px;
        border-bottom: 1px solid #e6e6eb !important;

        width: 100%;
        height: 41px;
    }
    .tab-options {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        padding: 0px;

        width: 100%;
        height: 28px;
        // left: 16px;
        // top: 12px;
        // border-bottom: 1px solid #e6e6eb;
    }
    .tab {
        width: 39px;
        height: 28px;
    }
    .tab-2 {
        margin: 0px 15px;
    }
    .selected-underline {
        border-bottom: 2px solid #5277d7;
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
</style>
