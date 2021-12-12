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
            <AtlanIcon icon="FolderClosed"></AtlanIcon>
            <span class="flex pl-0.5 text-xs text-gray-500 truncate mt-0.5">
                {{ selectedFolder }}
            </span>
        </AtlanBtn>

        <template #overlay>
            <div class="popover-container">
                <div class="m-4 w-9/11">
                    <ClassificationDropdown
                        :modelValue="savedQueryType2"
                        @change="onClassificationChange"
                        :connector="connector"
                    />
                </div>
                <div
                    class="h-full pt-0 pb-4 mx-4 overflow-y-hidden w-9/11"
                    @mouseleave="closeDropdown"
                >
                    <div class="flex w-full">
                        <AtlanIcon
                            :icon="folderOpened ? 'CaretDown' : 'CaretRight'"
                            class="my-auto mr-0.5 cursor-pointer"
                            @click="toggleFolder"
                        ></AtlanIcon>
                        <div
                            @click="onSelect('root', 'root')"
                            class="flex w-full px-1 py-1 rounded cursor-pointer"
                            :class="`${
                                selectedFolderContext?.guid ===
                                queryFolderNamespace?.guid
                                    ? 'bg-primary-selected-focus w-9/11'
                                    : 'bg-white'
                            }`"
                        >
                            <AtlanIcon
                                :icon="
                                    folderOpened ? 'FolderOpen' : 'FolderClosed'
                                "
                                class="w-2 h-5 my-auto mr-1"
                            ></AtlanIcon>
                            <span
                                class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                                >{{ savedQueryType2?.displayName }} Folder</span
                            >
                        </div>
                    </div>
                    <div
                        class="w-full h-full py-0 pl-3 pr-4 bg-white"
                        v-if="folderOpened"
                    >
                        <div class="mt-1 ml-3">
                            <query-tree-list
                                :savedQueryType="savedQueryType2"
                                :tree-data="treeData"
                                :on-load-data="onLoadData"
                                :select-node="onSelect"
                                :expand-node="expandNode"
                                :is-loading="isInitingTree"
                                :loaded-keys="loadedKeys"
                                :selected-keys="selectedKeys"
                                :expanded-keys="expandedKeys"
                                v-if="treeData.length"
                                :selectedNewFolder="selectedFolderContext"
                            />
                            <div
                                v-else
                                class="flex flex-col items-center justify-center mt-4"
                            >
                                <p
                                    class="my-2 mb-0 mb-6 text-xs text-center text-gray-700 max-width-text"
                                >
                                    Sorry, no data found <br />in selected
                                    classification
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </a-dropdown>
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
    // import { colSize } from 'ant-design-vue/lib/grid/Col'
    import ClassificationDropdown from '~/components/insights/common/classification/index.vue'

    export default defineComponent({
        components: {
            QueryTreeList,
            AtlanBtn,
            // AssetDropdown,
            ClassificationDropdown,
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

            const selectedFolder = ref('Folder')
            const selectedKey = ref<string[]>([])
            let dropdownVisible = ref(false)
            let selectedFolderContext = ref({})

            // console.log('already selected: ', props.selectedFolderQF)
            // console.log('already selected: ', parentFolder)

            watch(
                parentFolder,
                () => {
                    let item = parentFolder.value
                    // console.log('parent folder 1: ', parentFolder.value)

                    if (item?.typeName === 'QueryFolderNamespace') {
                        let rootData = {
                            ...item,
                            attributes: {
                                ...item.attributes,
                                parentQualifiedName: 'namespace',
                            },
                        }

                        let data = {
                            dataRef: {
                                ...rootData,
                            },
                            selectedFolderClassification:
                                savedQueryType2.value?.name,
                        }
                        if (savedQueryType.value) {
                            selectedFolder.value = `${savedQueryType.value?.displayName} folder`
                        }
                        selectedKey.value = [rootData.guid]
                        dropdownVisible.value = false
                        selectedFolderContext.value = {
                            ...rootData,
                            selectedFolderClassification: savedQueryType2.value,
                        }

                        emit('folderChange', data)
                    } else {
                        if (item?.typeName === 'QueryFolder') {
                            selectedKey.value = [item.guid]
                            selectedFolder.value = item.title
                            dropdownVisible.value = false

                            selectedFolderContext.value = {
                                ...parentFolder.value,
                                selectedFolderClassification:
                                    savedQueryType2.value,
                            }

                            emit('folderChange', {
                                dataRef: parentFolder.value,
                                selectedFolderClassification:
                                    savedQueryType2.value.name,
                            })
                        }
                    }
                },
                { immediate: true }
            )

            const onSelect = (selected: any, event: any) => {
                if (event === 'root') {
                    let rootData = {
                        ...queryFolderNamespace.value,
                        attributes: {
                            ...queryFolderNamespace.value.attributes,
                            parentQualifiedName: 'namespace',
                        },
                    }

                    let data = {
                        dataRef: {
                            ...rootData,
                        },
                        selectedFolderClassification:
                            savedQueryType2.value?.name,
                    }

                    if (savedQueryType.value) {
                        selectedFolder.value = `${savedQueryType2.value?.displayName} folder`
                    }
                    selectedKey.value = [rootData.guid]
                    dropdownVisible.value = false
                    // selectedFolderContext.value = data
                    selectedFolderContext.value = {
                        ...rootData,
                        selectedFolderClassification: savedQueryType2.value,
                    }

                    emit('folderChange', data)
                } else {
                    const item = event.node.dataRef.entity

                    if (item.typeName === 'QueryFolder') {
                        selectedKey.value = [item.guid]
                        selectedFolder.value = event?.node?.dataRef.title
                        dropdownVisible.value = false
                    }

                    // selectedFolderContext.value = {
                    //     dataRef: event.node,
                    //     selectedFolderClassification:
                    //         savedQueryType2.value.name,
                    // }
                    selectedFolderContext.value = {
                        ...item,
                        selectedFolderClassification: savedQueryType2.value,
                    }
                    emit('folderChange', {
                        dataRef: event.node,
                        selectedFolderClassification:
                            savedQueryType2.value.name,
                    })
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

            // const classificationValue = ref(savedQueryType2?.value?.name)
            let selectedClassification = ref(savedQueryType2?.value?.name)
            const onClassificationChange = (value) => {
                // emit('change', checkedValues)
                console.log('change: ', value)
                selectedClassification.value = value.name
                savedQueryType2.value = value
            }

            const pushGuidToURL = (guid: string) => {
                const queryParams = { id: guid }
                if (route?.query?.vqb) queryParams.vqb = true
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

            const { openSavedQueryInNewTab } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )

            const selectedCollection = computed(() => {
                const collection = queryCollections.value?.find(
                    (coll) =>
                        coll.attributes.qualifiedName ===
                        activeInlineTab.value.explorer.queries.collection
                            .qualifiedName
                )
                return collection
            })

            const {
                treeData: treeData,
                loadedKeys: loadedKeys,
                isInitingTree: isInitingTree,
                selectedKeys: selectedKeys,
                expandedKeys: expandedKeys,
                immediateParentFolderQF: immediateParentFolderQF,
                onLoadFolderData: onLoadData,
                expandNode: expandNode,
                selectNode: selectNode,
                refetchNode: refetchNode,
                immediateParentGuid: immediateParentGuid,
                nodeToParentKeyMap: nodeToParentKeyMap,
                currentSelectedNode: currentSelectedNode,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                savedQueryType: selectedClassification,
                queryFolderNamespace,
                permissions: {
                    readQueries: permissions.value.public.readQueries,
                    readFolders: permissions.value.public.readFolders,
                },
                collection: selectedCollection,
            })

            const folderOpened = ref(true)
            const toggleFolder = () => {
                folderOpened.value = !folderOpened.value
            }

            return {
                onSelect,
                selectedFolder,
                savedQueryType2,
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
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
                // classificationValue,
                onClassificationChange,
                folderOpened,
                toggleFolder,
                currentSelectedNode,
                selectedFolderContext,
                queryFolderNamespace,
            }
        },
    })
</script>

<style lang="less" scoped>
    .popover-container {
        width: 295px;
        height: 257px;

        background: #ffffff;

        box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
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
