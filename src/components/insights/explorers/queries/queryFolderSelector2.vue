<template>
    <div class="popover-container">
        <div class="w-full h-full pb-4">
            <div class="my-1 mb-2 w-9/11">
                <ClassificationDropdown
                    :modelValue="savedQueryType"
                    @change="onClassificationChange"
                />
            </div>
            <!--explorer pane start -->
            <div class="w-full h-full pr-4 overflow-y-scroll bg-white">
                <div class="flex w-full rounded">
                    <AtlanIcon
                        :icon="folderOpened ? 'CaretDown' : 'CaretRight'"
                        class="my-auto mr-0.5 cursor-pointer"
                        @click="toggleFolder"
                    ></AtlanIcon>
                    <div
                        @click="onSelect('root', 'root')"
                        class="flex w-full py-1 rounded cursor-pointer"
                        :class="`${
                            selectedFolderContext?.guid ===
                            queryFolderNamespace?.guid
                                ? 'bg-primary-selected-focus w-9/11'
                                : 'bg-white'
                        }`"
                    >
                        <AtlanIcon
                            :icon="folderOpened ? 'FolderOpen' : 'FolderClosed'"
                            class="w-2 h-5 my-auto mr-1"
                        ></AtlanIcon>
                        <span
                            class="mb-0 text-sm text-gray-700 parent-ellipsis-container-base"
                            >{{ savedQueryType2?.displayName }} Folder</span
                        >
                    </div>
                </div>
                <div v-if="folderOpened" class="mt-1 ml-3">
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
                        :selectedNewFolder="selectedFolderContext"
                        :selectedFolderHide="selectedNewFolder"
                        v-if="treeData.length"
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
    import { useRouter, useRoute } from 'vue-router'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import AtlanBtn from '@/UI/button.vue'
    // import AssetDropdown from '~/components/common/dropdown/assetDropdown.vue'
    import { Folder } from '~/types/insights/savedQuery.interface'
    import ClassificationDropdown from '~/components/insights/common/classification/index.vue'

    export default defineComponent({
        components: {
            QueryTreeList,
            AtlanBtn,
            ClassificationDropdown,
            // AssetDropdown,
        },
        props: {
            // selectedFolderQF: {
            //     type: String,
            //     required: false,
            //     default: '',
            // },
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

            const router = useRouter()
            const { connector, savedQueryType, selectedNewFolder } =
                toRefs(props)

            const savedQueryType2: Ref<object> = ref(savedQueryType.value)
            const queryFolderNamespace = inject<Ref<Folder>>(
                'queryFolderNamespace',
                ref({}) as Ref<Folder>
            )

            const selectedFolder = ref('Folder')
            const selectedKey = ref<string[]>([])
            let dropdownVisible = ref(false)
            let selectedFolderContext = ref({})

            // console.log('already selected: ', props.selectedFolderQF)

            const onSelect = (selected: any, event: any) => {
                // console.log('folder select: ', event)

                console.log('savedQueryType2: ', savedQueryType2.value)
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
                        selectedFolderClassification: savedQueryType2.value,
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

                        selectedFolderContext.value = {
                            ...rootData,
                            selectedFolderClassification: savedQueryType2.value,
                        }

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

                            selectedFolderContext.value = {
                                ...item,
                                selectedFolderClassification:
                                    savedQueryType2.value,
                            }

                            emit('folderChange', {
                                dataRef: event.node,
                                selectedFolderClassification:
                                    savedQueryType2.value,
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
            let selectedClassification = ref(savedQueryType2?.value?.name)

            const onClassificationChange = (value) => {
                // emit('change', checkedValues)
                console.log('change: ', value)
                selectedClassification.value = value.name
                savedQueryType2.value = value
            }

            // const isSelectedType = (type: 'personal' | 'all') => {
            //     return savedQueryType2.value === type
            // }
            // const onSelectQueryType = (type: 'personal' | 'all') => {
            //     savedQueryType2.value = type
            // }

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

            const {
                treeData: treeData,
                loadedKeys: loadedKeys,
                isInitingTree: isInitingTree,
                selectedKeys: selectedKeys,
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
                savedQueryType: selectedClassification,
                queryFolderNamespace,
                /* PERMISSIONS */
                permissions: {
                    readQueries: permissions.value.public.readQueries,
                    readFolders: permissions.value.public.readFolders,
                },
            })

            const folderOpened = ref(true)

            const toggleFolder = () => {
                folderOpened.value = !folderOpened.value
            }

            return {
                folderOpened,
                toggleFolder,

                onSelect,
                selectedFolder,
                // treeData,

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
                selectedNewFolder,
                classificationValue,
                onClassificationChange,
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
