<template>
    <div class="popover-container">
        <div class="w-full h-full">
            <!--explorer pane start -->
            <div class="w-full h-full pt-3 overflow-y-hidden">
                <div class="flex items-center justify-between px-4">
                    <span class="text-sm font-bold text-gray-700">Move to</span>

                    <a-tooltip placement="right" color="#363636">
                        <template #title> Add folder </template>

                        <AtlanIcon
                            color="#5277D7"
                            icon="NewFolder"
                            class="h-4 outline-none hover:text-primary"
                            @click="createFolderInput"
                        />
                    </a-tooltip>
                </div>
                <div
                    class="flex items-center justify-between w-full h-8 px-4 mt-2"
                    :class="`${
                        selectedFolderContext?.guid === selectedCollection?.guid
                            ? 'bg-primary-light'
                            : 'bg-white hover:bg-gray-100'
                    }`"
                >
                    <div
                        @click="onSelect('root', 'root')"
                        class="flex items-center w-full cursor-pointer"
                    >
                        <AtlanIcon
                            icon="CollectionIconSmall"
                            class="w-4 h-4 my-auto mr-2"
                        ></AtlanIcon>
                        <span
                            class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                            >{{ selectedCollection?.attributes.name }}</span
                        >
                    </div>

                    <AtlanIcon
                        v-if="
                            selectedFolderContext?.guid ===
                            selectedCollection?.guid
                        "
                        icon="Check"
                        class="w-4 h-4 text-primary"
                    />
                </div>

                <div class="w-full h-full overflow-y-scroll bg-white">
                    <query-tree-list
                        v-if="newTreeData?.length"
                        :tree-data="newTreeData"
                        :on-load-data="onLoadData"
                        :select-node="onSelect"
                        :expand-node="expandNode"
                        :is-loading="isInitingTree"
                        :loaded-keys="loadedKeys"
                        :selected-keys="selectedKey"
                        :expanded-keys="expandedKeys"
                        :selected-new-folder="selectedFolderContext"
                        :selected-folder-hide="selectedNewFolder"
                        class="pb-4 folder-list"
                    />
                    <div
                        v-else
                        class="flex flex-col items-center justify-center mt-4 folder-list"
                    >
                        <!-- <p
                            class="my-2 mb-0 mb-6 text-xs text-center text-gray-700 max-width-text"
                        >
                            Sorry, no data found <br />in selected
                            classification
                        </p> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        toRefs,
        ref,
        PropType,
        Ref,
        inject,
        ComputedRef,
        computed,
        watch,
    } from 'vue'

    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    import QueryTreeList from './queryTreeList.vue'
    import useQueryTree from './composables/useQueryTree'
    import { useRouter, useRoute } from 'vue-router'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import AtlanBtn from '@/UI/button.vue'
    // import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import {
        Folder,
        QueryCollection,
    } from '~/types/insights/savedQuery.interface'

    export default defineComponent({
        components: {
            QueryTreeList,
            AtlanBtn,
        },
        props: {
            connector: {
                type: String as PropType<string | undefined>,
                required: true,
                default: '',
            },
            savedQueryType: {
                type: Object as PropType<object>,
                required: true,
            },
            selectedNewFolder: {
                type: Object,
                required: false,
            },
        },
        emits: ['folderChange'],
        setup(props, { emit }) {
            const route = useRoute()
            const permissions = inject('permissions') as ComputedRef<any>
            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >

            const router = useRouter()
            const { connector, savedQueryType, selectedNewFolder } =
                toRefs(props)

            const queryFolderNamespace = inject<Ref<Folder>>(
                'queryFolderNamespace',
                ref({}) as Ref<Folder>
            )

            const refetchRootNode = inject<
                (guid: string, type: 'query' | 'Folder') => void
            >('refetchNode', () => {})

            const selectedFolder = ref()
            const selectedKey = ref<string[]>([])
            let dropdownVisible = ref(false)
            let selectedFolderContext = ref({})
            const selectedCollection = computed(() => {
                const collection = queryCollections.value?.find(
                    (coll) =>
                        coll.attributes.qualifiedName ===
                        activeInlineTab.value.explorer.queries.collection
                            .qualifiedName
                )
                return collection
            })

            // console.log('already selected: ', props.selectedFolderQF)

            const onSelect = (selected: any, event: any) => {
                // console.log('folder select: ', event)

                if (event === 'root') {
                    const rootData = selectedCollection.value

                    let data = {
                        dataRef: {
                            ...rootData,
                        },
                    }

                    if (
                        selectedNewFolder?.value.guid ===
                        selectedCollection?.value?.guid
                    ) {
                        console.log(`same folder can't be selected`)
                        emit('folderChange', null)
                    } else {
                        selectedKey.value = [selectedCollection?.value?.guid]
                        selectedFolder.value =
                            selectedCollection.value?.attributes.name
                        dropdownVisible.value = false

                        selectedFolderContext.value = {
                            ...rootData,
                        }

                        emit('folderChange', data)
                    }
                } else {
                    const item = event.node.dataRef.entity
                    // console.log('folder select: ', event)
                    // console.log('selected item: ', item)

                    if (item.typeName === 'Folder') {
                        if (
                            selectedNewFolder?.value.guid ===
                            event.node.dataRef.guid
                        ) {
                            console.log(`same folder can't be selected`)
                            emit('folderChange', null)
                        } else {
                            selectedKey.value = [item.guid]
                            selectedFolder.value = event?.node?.dataRef.title
                            dropdownVisible.value = false

                            selectedFolderContext.value = {
                                ...item,
                            }

                            emit('folderChange', {
                                dataRef: event.node,
                            })
                        }
                    }
                }
            }

            const toggleDropdown = () => {
                dropdownVisible.value = !dropdownVisible.value
            }

            const closeDropdown = () => {
                dropdownVisible.value = false
            }
            const showDropdown = () => {
                dropdownVisible.value = true
            }

            const classificationValue = ref()

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
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

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
                expandedKeys: expandedKeys,
                onLoadFolderData: onLoadData,
                expandNode: expandNode,
                selectNode: selectNode,
                refetchNode: refetchNode,
                immediateParentFolderQF: immediateParentFolderQF,
                immediateParentGuid: immediateParentGuid,
                nodeToParentKeyMap: nodeToParentKeyMap,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                queryFolderNamespace,
                /* PERMISSIONS */
                permissions: {
                    readQueries: permissions.value.public.readQueries,
                    readFolders: permissions.value.public.readFolders,
                },
                collection: selectedCollection,
            })

            const newTreeData = computed(() => {
                let data = treeData?.value?.filter(
                    (el) => el.typeName !== 'Query'
                )
                // console.log('new tree: ', data)
                return data
            })

            let saveFolderLoading = ref(false)

            const createFolderInput = () => {
                const inputClassName = `${selectedCollection?.value?.guid}_folder_input`

                const existingInputs =
                    document.getElementsByClassName(inputClassName)

                let parentGuid = ref(selectedCollection?.value?.guid)
                let parentQualifiedName = ref(
                    selectedCollection?.value?.attributes.qualifiedName
                )

                const appendInput = () => {
                    if (!existingInputs.length && newFolderCreateable.value) {
                        let parentFolder =
                            document.querySelector('.folder-list')?.parentNode
                        let ul = document.createElement('div')
                        const div = document.createElement('div')

                        showEmptyState.value = false

                        div.classList.add(
                            'flex',
                            'items-center',
                            'active-input',
                            'h-8'
                        )

                        let caret =
                            '<span class="mt-2 ml-1 ant-tree-switcher ant-tree-switcher_close"><svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-auto ant-tree-switcher-icon" data-v-b3169684="" style="height: 1rem;"><path d="m6 4 3.646 3.646a.5.5 0 0 1 0 .708L6 12" stroke="#6F7590" stroke-linecap="round"></path></svg></span>'

                        const caretEl = new DOMParser().parseFromString(
                            caret,
                            'text/html'
                        ).body.firstElementChild

                        const folderSvg =
                            '<span class="w-4 h-4 mr-1 -ml-1 mb-0.5"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"  data-v-a0c5611e="" style="height: 1rem;"><path d="M5.5 2h-2a1 1 0 0 0-1 1v8.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-4a1 1 0 0 1-1-1 1 1 0 0 0-1-1Z" fill="#fff" stroke="#5277D7"></path><path d="M13.327 6H2.612a1 1 0 0 0-.995 1.106l.587 5.5a1 1 0 0 0 .994.894h9.249a1 1 0 0 0 .987-.842l.88-5.5A1 1 0 0 0 13.327 6Z" fill="#fff" stroke="#5277D7"></path></svg></span>'

                        const folderSvgEl = new DOMParser().parseFromString(
                            folderSvg,
                            'text/html'
                        ).body.firstElementChild

                        let space = `<span style="padding-left:16px;" class="h-2"></span>`
                        let spaceEl = new DOMParser().parseFromString(
                            space,
                            'text/html'
                        ).body.firstElementChild

                        div.appendChild(spaceEl)
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
                                selectedCollection
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

                                    setTimeout(async () => {
                                        await refetchRootNode(
                                            parentGuid.value,
                                            'Folder'
                                        )
                                    }, 2000)
                                }
                            })
                        }

                        input.setAttribute(
                            'class',
                            `outline-none py-0 rounded my-1 w-full ${inputClassName}`
                        )
                        input.setAttribute('placeholder', 'Name your folder')
                        input.addEventListener('input', (e) => {
                            newFolderName.value = e.target?.value
                        })

                        input.addEventListener('keydown', (e) => {
                            if (e.key === 'Escape') {
                                newFolderName.value = ''
                                ul.removeChild(div)
                                // removeInputBox()
                                showEmptyState.value = true
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
                                }, 300)
                            }
                        })

                        div.appendChild(input)
                        ul.appendChild(div)
                        parentFolder?.prepend(ul)
                        // parentFolder?.insertBefore(ul, parentFolder?.firstChild)

                        input.focus()
                    }
                }

                appendInput()
                // if the folder is not loaded, don't do anything
            }

            return {
                onSelect,
                selectedFolder,
                // treeData,
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
                selectedNewFolder,
                classificationValue,
                selectedFolderContext,
                queryFolderNamespace,
                selectedCollection,
                createFolderInput,
                newTreeData,
            }
        },
    })
</script>

<style lang="less" scoped>
    .popover-container {
        width: 295px;
        max-height: 272px;

        // background: #ffffff;

        // box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
        // border-radius: 4px;
        overflow-y: scroll;
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
</style>
<style lang="less" module></style>
