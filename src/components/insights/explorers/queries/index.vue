<template>
    <div class="flex flex-col items-center w-full h-full bg-white">
        <div class="w-full p-4 pb-0 rounded">
            <Connector :connector="connector" @update:data="updateConnector" />
            <div class="flex flex-row space-x-2">
                <a-input-search class="mt-2 rounded" placeholder="Search" />
                <a-button class="flex items-center w-8 h-8 p-2 mt-2 rounded">
                    <AtlanIcon icon="Filter" />
                </a-button>
            </div>
        </div>
        <div class="w-full my-4 border-b"></div>
        <div class="w-full p-4 pt-0">
            <div class="flex justify-between text-gray-500">
                <div class="px-3 py-1 rounded shadow">
                    <span
                        class="mr-4 cursor-pointer hover:text-primary-400"
                        :class="
                            isSelectedType('personal') ? ' text-primary' : ''
                        "
                        @click="() => onSelectQueryType('personal')"
                        >Personal</span
                    >
                    <span
                        class="cursor-pointer hover:text-primary-400"
                        :class="isSelectedType('all') ? ' text-primary' : ''"
                        @click="() => onSelectQueryType('all')"
                        >All</span
                    >
                </div>
                <div class="flex items-center">
                    <div class="">
                        <AtlanIcon
                            @click="toggleCreateQueryModal"
                            icon="NewQuery"
                            class="h-4 m-0 mr-4 -mt-0.5 hover:text-primary"
                        />
                    </div>
                    <div class="">
                        <AtlanIcon
                            icon="NewFolder"
                            class="h-4 m-0 -mt-0.5 hover:text-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div
            class="w-full h-full p-3 pt-0 overflow-y-auto scrollable-container"
        >
            <query-tree
                :tree-data="treeData"
                :on-load-data="onLoadData"
                :select-node="selectNode"
                :expand-node="expandNode"
                :is-loading="isInitingTree"
                :loaded-keys="loadedKeys"
                :selected-keys="selectedKeys"
                :expanded-keys="expandedKeys"
            />
        </div>
        <SaveQueryModal
            v-model:showSaveQueryModal="showSaveQueryModal"
            :saveQueryLoading="saveQueryLoading"
            :ref="
                (el) => {
                    saveModalRef = el
                }
            "
            @onSaveQuery="saveQuery"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        inject,
        Ref,
        ComputedRef,
        watch,
        ref,
        toRaw,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'

    import QueryTree from './queryTree.vue'
    import useQueryTree from './composables/useQueryTree'

    import Connector from '~/components/insights/common/connector/connectorOnly.vue'

    export default defineComponent({
        components: { QueryTree, Connector, SaveQueryModal },
        props: {},
        setup(props, { emit }) {
            const router = useRouter()
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const saveQueryLoading = ref(false)
            const saveModalRef = ref()
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const savedQueryType: Ref<'personal' | 'all'> = ref('personal')
            const editorInstance = inject('editorInstance') as Ref<any>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const { setConnectorsDataInInlineTab, getConnectorName } =
                useConnector()
            const connector = ref(
                getConnectorName(
                    activeInlineTab.value.explorer.schema.connectors
                        .attributeValue
                )
            )
            const { focusEditor } = useEditor()

            const isSelectedType = (type: string) => {
                return savedQueryType.value === type
            }
            const onSelectQueryType = (type: 'personal' | 'all') => {
                savedQueryType.value = type
            }

            const {
                openSavedQueryInNewTab,
                saveQueryToDatabaseAndOpenInNewTab,
            } = useSavedQuery(inlineTabs, activeInlineTab, activeInlineTabKey)
            const isSavedQueryOpened = (savedQuery: SavedQueryInterface) => {
                let bool = false
                inlineTabs.value.forEach((tab) => {
                    if (tab.key === savedQuery.id) bool = true
                })
                return bool
            }

            const updateConnector = (value: string) => {
                connector.value = value;
                setConnectorsDataInInlineTab(
                    activeInlineTab,
                    inlineTabs,
                    connector,
                    'queries'
                )
            }
            const toggleCreateQueryModal = () => {
                showSaveQueryModal.value = !showSaveQueryModal.value
            }
            const pushGuidToURL = (guid: string) => {
                router.push(`/insights?id=${guid}`)
            }

            const {
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                savedQueryType
            })

            watch(activeInlineTabKey, (newActiveInlineTab) => {
                selectedKeys.value = [newActiveInlineTab]
            })

            watch(activeInlineTab, (newActiveInlineTab) => {
                if (newActiveInlineTab) {
                    connector.value =
                        newActiveInlineTab?.explorer?.queries?.connectors?.connector
                }
            })
            const saveQuery = (saveQueryData: any) => {
                saveQueryToDatabaseAndOpenInNewTab(
                    saveQueryData,
                    editorInstance,
                    saveQueryLoading,
                    showSaveQueryModal,
                    saveModalRef,
                    router
                )
                focusEditor(toRaw(editorInstance.value))
            }

            return {
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                saveQuery,
                toggleCreateQueryModal,
                onSelectQueryType,
                isSelectedType,
                isSavedQueryOpened,
                openSavedQueryInNewTab,
                connector,
                updateConnector,
                savedQueryType,
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .active-placeholder {
        @apply bg-primary text-white;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
