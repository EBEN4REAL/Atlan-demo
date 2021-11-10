<template>
    <div class="popover-container">
        <div class="w-full h-full pt-2 pb-4 overflow-y-scroll">
            <!--explorer pane start -->
            <div
                v-if="savedQueryType2 === 'personal'"
                class="w-full h-full bg-white py-1.5 pl-3 pr-4"
            >
                <div class="flex w-full">
                    <AtlanIcon
                        :icon="
                            folderOpened['personal']
                                ? 'CaretDown'
                                : 'CaretRight'
                        "
                        class="my-auto mr-0.5 cursor-pointer"
                        @click="toggleFolder('personal')"
                    ></AtlanIcon>
                    <div
                        @click="onSelect('root', 'root')"
                        class="flex cursor-pointer"
                    >
                        <AtlanIcon
                            :icon="
                                folderOpened['personal']
                                    ? 'FolderOpen'
                                    : 'FolderClosed'
                            "
                            class="w-2 h-5 my-auto mr-1"
                        ></AtlanIcon>
                        <span
                            class="mb-0 text-sm text-gray-700  parent-ellipsis-container-base"
                            >Your Personal Folder</span
                        >
                    </div>
                </div>
                <div v-if="folderOpened['personal']" class="mt-1 ml-3">
                    <query-tree-list
                        :savedQueryType="savedQueryType"
                        :tree-data="per_treeData"
                        :on-load-data="per_onLoadData"
                        :select-node="onSelect"
                        :expand-node="per_expandNode"
                        :is-loading="per_isInitingTree"
                        :loaded-keys="per_loadedKeys"
                        :selected-keys="per_selectedKeys"
                        :expanded-keys="per_expandedKeys"
                        :selectedNewFolder="selectedNewFolder"
                    />
                </div>
            </div>
            <div
                v-if="savedQueryType2 === 'all'"
                class="w-full h-full bg-white py-1.5 pl-3 pr-4"
            >
                <div class="flex w-full">
                    <AtlanIcon
                        :icon="folderOpened['all'] ? 'CaretDown' : 'CaretRight'"
                        class="my-auto mr-0.5 cursor-pointer"
                        @click="toggleFolder('all')"
                    ></AtlanIcon>
                    <div
                        @click="onSelect('root', 'root')"
                        class="flex cursor-pointer"
                    >
                        <AtlanIcon
                            :icon="
                                folderOpened['all']
                                    ? 'FolderOpen'
                                    : 'FolderClosed'
                            "
                            class="w-2 h-5 my-auto mr-1"
                        ></AtlanIcon>
                        <span
                            class="mb-0 text-sm text-gray-700  parent-ellipsis-container-base"
                            >Atlan's Public Folder</span
                        >
                    </div>
                </div>
                <div v-if="folderOpened['all']" class="mt-1 ml-3">
                    <query-tree-list
                        :savedQueryType="savedQueryType"
                        :tree-data="all_treeData"
                        :on-load-data="all_onLoadData"
                        :select-node="onSelect"
                        :expand-node="all_expandNode"
                        :is-loading="all_isInitingTree"
                        :loaded-keys="all_loadedKeys"
                        :selected-keys="all_selectedKeys"
                        :expanded-keys="all_expandedKeys"
                        :selectedNewFolder="selectedNewFolder"
                    />
                </div>
            </div>
            <!--explorer pane end -->
        </div>
    </div>
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
    } from 'vue'

    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    import QueryTreeList from './queryTreeList.vue'
    import useQueryTree from './composables/useQueryTree'
    import { useRouter } from 'vue-router'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import AtlanBtn from '@/UI/button.vue'
    import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import { Folder } from '~/types/insights/savedQuery.interface'

    export default defineComponent({
        components: {
            QueryTreeList,
            AtlanBtn,
            AssetDropdown,
        },
        props: {
            selectedFolderQF: {
                type: String,
                required: false,
                default: '',
            },
            connector: {
                type: String as PropType<string | undefined>,
                required: true,
                default: '',
            },
            savedQueryType: {
                type: String as PropType<'personal' | 'all'>,
                required: true,
                default: 'personal',
            },
            selectedNewFolder: {
                type: Object,
                required: false,
            },
        },
        emits: ['folderChange'],
        setup(props, { emit }) {
            const permissions = inject('permissions') as ComputedRef<any>

            const router = useRouter()
            const { connector, savedQueryType, selectedNewFolder } =
                toRefs(props)

            const savedQueryType2: Ref<'personal' | 'all'> = ref(
                savedQueryType.value
            )
            const queryFolderNamespace = inject<Ref<Folder>>(
                'queryFolderNamespace',
                ref({}) as Ref<Folder>
            )

            const selectedFolder = ref('Folder')
            const selectedKey = ref<string[]>([])
            let dropdownVisible = ref(false)

            // console.log('already selected: ', props.selectedFolderQF)

            const onSelect = (selected: any, event: any) => {
                // console.log('folder select: ', event)

                console.log('qfn: ', queryFolderNamespace.value)
                if (event === 'root') {
                    let rootData = {
                        ...queryFolderNamespace.value,
                        attributes: {
                            ...queryFolderNamespace.value.attributes,
                            parentFolderQualifiedName: 'namespace',
                        },
                    }

                    let data = {
                        dataRef: {
                            ...rootData,
                        },
                    }

                    if (
                        selectedNewFolder?.value.guid ===
                        queryFolderNamespace.value.guid
                    ) {
                        console.log(`same folder can't be selected`)
                        emit('folderChange', null)
                    } else {
                        selectedKey.value = [rootData.guid]
                        selectedFolder.value = 'Root'
                        dropdownVisible.value = false

                        emit('folderChange', data)
                    }
                } else {
                    const item = event.node.dataRef.entity
                    // console.log('folder select: ', event)
                    // console.log('selected item: ', item)

                    if (item.typeName === 'QueryFolder') {
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

                            emit('folderChange', event.node)
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

            const isSelectedType = (type: 'personal' | 'all') => {
                return savedQueryType2.value === type
            }
            const onSelectQueryType = (type: 'personal' | 'all') => {
                savedQueryType2.value = type
            }

            const pushGuidToURL = (guid: string) => {
                router.push(`/insights?id=${guid}`)
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

            const {
                treeData: per_treeData,
                loadedKeys: per_loadedKeys,
                isInitingTree: per_isInitingTree,
                selectedKeys: per_selectedKeys,
                expandedKeys: per_expandedKeys,
                onLoadFolderData: per_onLoadData,
                expandNode: per_expandNode,
                selectNode: per_selectNode,
                refetchNode: per_refetchNode,
                immediateParentFolderQF: per_immediateParentFolderQF,
                immediateParentGuid: per_immediateParentGuid,
                nodeToParentKeyMap: per_nodeToParentKeyMap,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                savedQueryType: ref('personal'),
                queryFolderNamespace,
                /* PERMISSIONS */
                permissions: {
                    readQueries: permissions.value.private.readQueries,
                    readFolders: permissions.value.private.readFolders,
                },
            })
            const {
                treeData: all_treeData,
                loadedKeys: all_loadedKeys,
                isInitingTree: all_isInitingTree,
                selectedKeys: all_selectedKeys,
                expandedKeys: all_expandedKeys,
                immediateParentFolderQF: all_immediateParentFolderQF,
                onLoadFolderData: all_onLoadData,
                expandNode: all_expandNode,
                selectNode: all_selectNode,
                refetchNode: all_refetchNode,
                immediateParentGuid: all_immediateParentGuid,
                nodeToParentKeyMap: all_nodeToParentKeyMap,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                savedQueryType: ref('all'),
                queryFolderNamespace,
                /* PERMISSIONS */
                permissions: {
                    readQueries: permissions.value.public.readQueries,
                    readFolders: permissions.value.public.readFolders,
                },
            })

            const folderOpened = ref({
                all: false,
                personal: false,
            })

            const toggleFolder = (type) => {
                if (type === 'all') {
                    folderOpened.value['all'] = !folderOpened.value['all']
                } else {
                    folderOpened.value['personal'] =
                        !folderOpened.value['personal']
                }
            }

            return {
                folderOpened,
                toggleFolder,

                onSelect,
                selectedFolder,
                // treeData,

                savedQueryType2,
                isSelectedType,
                onSelectQueryType,
                all_treeData,
                per_treeData,
                all_loadedKeys,
                per_loadedKeys,
                all_isInitingTree,
                per_isInitingTree,
                all_selectedKeys: selectedKey,
                per_selectedKeys: selectedKey,
                all_expandedKeys,
                per_expandedKeys,
                all_onLoadData,
                per_onLoadData,
                all_expandNode,
                per_expandNode,
                all_selectNode,
                per_selectNode,
                all_refetchNode,
                per_refetchNode,
                all_immediateParentFolderQF,
                per_immediateParentFolderQF,
                all_immediateParentGuid,
                per_immediateParentGuid,
                all_nodeToParentKeyMap,
                per_nodeToParentKeyMap,
                toggleDropdown,
                dropdownVisible,
                closeDropdown,
                showDropdown,
                selectedNewFolder,
            }
        },
    })
</script>

<style lang="less" scoped>
    .popover-container {
        width: 295px;
        height: 257px;

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
<style lang="less" module>
    .ant-popover-inner-content {
        padding: 0 !important;
    }
</style>