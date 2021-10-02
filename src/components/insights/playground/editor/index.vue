<template>
    <div class="w-full h-full px-3 rounded">
        <div class="w-full h-full overflow-x-hidden rounded">
            <div class="flex items-center justify-between w-full my-2">
                <div class="flex items-center text-base">
                    <AtlanIcon
                        class="w-4 h-4 mr-2 -mt-1 text-gray-500"
                        icon="Globe"
                    />
                    <span class="mr-1">{{ activeInlineTab.label }}</span>
                    <div class="-mt-0.5">
                        <StatusBadge
                            :status-id="activeInlineTab.status"
                            show-no-status
                        ></StatusBadge>
                    </div>
                    <div class="flex items-center">
                        <div
                            class="items-center justify-center px-1 mx-4 rounded cursor-pointer  hover:bg-gray-300"
                            :class="showcustomToolBar ? 'bg-gray-300' : ''"
                            @click="toggleCustomToolbar"
                        >
                            <!-- <AtlanIcon
                                class="w-4 h-4 mx-4 -mt-1 text-gray-500"
                                @click="toggleCustomToolbar"
                                icon="Activity"
                            /> -->
                            {&nbsp;}
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <!-- <div class="w-full">
                    <p class="mb-1 text-base">
                        {{ activeInlineTab.label ?? 'ATLAN_TRIAL.PUBLIC' }}
                    </p>
                </div> -->
                    <div class="flex mr-4 text-sm">
                        <a-button
                            type="primary"
                            class="flex items-center py-0.5 px-2 shadow"
                            :loading="
                                isQueryRunning === 'loading' ? true : false
                            "
                            @click="run"
                        >
                            <AtlanIcon class="mr-1 text-white" icon="Play" />
                            Run</a-button
                        >
                        <a-button
                            v-if="modalAction === 'CREATE'"
                            class="
                                flex
                                items-center
                                justify-between
                                ml-2
                                py-0.5
                                px-2
                                shadow
                            "
                            @click="openSaveQueryModal"
                        >
                            <AtlanIcon class="mr-1" icon="Save" />
                            Save
                        </a-button>
                        <a-button
                            v-else
                            class="
                                flex
                                items-center
                                justify-between
                                ml-2
                                py-0.5
                                px-2
                                shadow
                            "
                            :loading="isUpdating"
                            @click="updateQuery"
                        >
                            <AtlanIcon class="mr-1" icon="Save" />
                            Update
                        </a-button>
                        <a-button
                            class="flex items-center ml-2 py-0.5 px-2 shadow"
                            v-if="activeInlineTab?.isSaved"
                            @click="copyURL"
                        >
                            <AtlanIcon class="mr-1" icon="Share" /><span
                                >Share</span
                            ></a-button
                        >
                        <ThreeDotMenu />
                    </div>
                </div>
            </div>
            <CustomVariablesNav v-if="editorInstance && showcustomToolBar" />
            <SaveQueryModal
                v-model:showSaveQueryModal="showSaveQueryModal"
                :saveQueryLoading="saveQueryLoading"
                :modalAction="modalAction"
                :ref="
                    (el) => {
                        saveModalRef = el
                    }
                "
                @onSaveQuery="saveQuery"
            />
            <Monaco @editorInstance="setInstance" />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        inject,
        Ref,
        defineAsyncComponent,
        ref,
        watch,
        ComputedRef,
        computed,
        toRaw,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '../common/composables/useRunQuery'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import CustomVariablesNav from '~/components/insights/playground/editor/customVariablesNav/index.vue'
    import ThreeDotMenu from '~/components/insights/playground/editor/threeDotMenu/index.vue'
    import { editor } from 'monaco-editor'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
    import { generateUUID } from '~/utils/helper/generator'
    import whoami from '~/composables/user/whoami'
    import { Insights } from '~/services/atlas/api/insights'
    import AtlanBtn from '~/components/UI/button.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message } from 'ant-design-vue'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import { serializeQuery } from '~/utils/helper/routerHelper'
    import StatusBadge from '@common/badge/status/index.vue'
    import { useRouter } from 'vue-router'
    export default defineComponent({
        components: {
            Monaco: defineAsyncComponent(() => import('./monaco/monaco.vue')),
            CustomVariablesNav,
            SaveQueryModal,
            AtlanBtn,
            ThreeDotMenu,
            StatusBadge,
        },
        props: {},
        setup() {
            const router = useRouter()

            const { queryRun } = useRunQuery()
            const { getParsedQuery } = useEditor()
            const { modifyActiveInlineTabEditor, modifyActiveInlineTab } =
                useInlineTab()
            const { getConnectorName, getConnectionQualifiedName } =
                useConnector()
            const { username } = whoami()
            const saveModalRef = ref()
            const showcustomToolBar = ref(false)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const editorInstance = inject('editorInstance') as Ref<any>
            const setEditorInstanceFxn = inject('setEditorInstance') as Function
            const saveQueryLoading = ref(false)
            const modalAction: ComputedRef<string> = computed(() =>
                activeInlineTab.value.isSaved ? 'UPDATE' : 'CREATE'
            )
            const { updateSavedQuery } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const isUpdateEnabled: Ref<boolean> = ref(false)
            const isUpdating: Ref<boolean> = ref(false)
            const openSaveQueryModal = () => {
                showSaveQueryModal.value = true
            }
            const saveQuery = async (saveQueryData: any) => {
                const attributeValue =
                    activeInlineTab.value.explorer.schema.connectors
                        .attributeValue
                const attributeName =
                    activeInlineTab.value.explorer.schema.connectors
                        .attributeName
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                activeInlineTabCopy.isSaved = true
                activeInlineTabCopy.label = saveQueryData.title
                activeInlineTabCopy.status = saveQueryData.assetStatus
                const uuidv4 = generateUUID()
                const integrationName = getConnectorName(attributeValue) ?? ''
                const connectionQualifiedName =
                    getConnectionQualifiedName(attributeValue)
                const connectionGuid = ''
                const connectionName = getConnectorName(attributeValue)
                const name = saveQueryData.title
                const description = saveQueryData.description
                const assetStatus = saveQueryData.assetStatus
                const isSQLSnippet = saveQueryData.isSQLSnippet
                const editorInstanceRaw = toRaw(editorInstance.value)
                const rawQuery = editorInstanceRaw?.getValue()
                const compiledQuery = getParsedQuery(
                    activeInlineTab.value.playground.editor.variables,
                    editorInstanceRaw?.getValue() as string
                )
                const qualifiedName = `${connectionQualifiedName}/query/user/${username.value}/${uuidv4}`
                const defaultSchemaQualifiedName =
                    `${attributeName}.${attributeValue}` ?? ''
                const variablesSchemaBase64 = serializeQuery(
                    activeInlineTab.value.playground.editor.variables
                )

                const body = ref({
                    entity: {
                        typeName: 'Query',
                        attributes: {
                            integrationName,
                            name,
                            qualifiedName,
                            connectionName,
                            defaultSchemaQualifiedName,
                            assetStatus,
                            isSnippet: isSQLSnippet,
                            connectionQualifiedName,
                            description,
                            owner: username.value,
                            tenantId: 'default',
                            rawQuery,
                            compiledQuery,
                            variablesSchemaBase64,
                            connectionId: connectionGuid,
                            isPrivate: true,
                        },
                        relationshipAttributes: {
                            folder: {
                                guid: '4a6ccb76-02f0-4cc3-9550-24c46166a93d',
                                typeName: 'QueryFolder',
                            },
                        },
                        /*TODO Created by will eventually change according to the owners*/
                        isIncomplete: false,
                        status: 'ACTIVE',
                        createdBy: username.value,
                    },
                })
                console.log(body.value, 'hola')
                // chaing loading to true
                saveQueryLoading.value = true
                const { data, error, isLoading } = Insights.CreateSavedQuery(
                    body.value
                )

                watch([data, error, isLoading], () => {
                    if (isLoading.value == false) {
                        saveQueryLoading.value = false
                        if (error.value === undefined) {
                            showSaveQueryModal.value = false
                            message.success({
                                content: `${name} query saved!`,
                            })
                            saveModalRef.value?.clearData()
                            modifyActiveInlineTab(
                                activeInlineTabCopy,
                                inlineTabs
                            )
                            isUpdateEnabled.value = false
                            const guid =
                                data.value.mutatedEntities.CREATE[0].guid
                            console.log(data.value, 'saved')
                            if (guid) router.push(`/insights?id=${guid}`)
                        } else {
                            console.log(error.value.toString())
                            message.error({
                                content: `Error in saving query!`,
                            })
                        }
                    }
                })
            }
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
                }
            }
            const run = () => {
                queryRun(activeInlineTab.value, getData, isQueryRunning)
            }

            const setInstance = (
                editorInstanceParam: editor.IStandaloneCodeEditor,
                monacoInstanceParam?: any
            ) => {
                setEditorInstanceFxn(editorInstanceParam, monacoInstanceParam)
            }
            const updateQuery = () => {
                updateSavedQuery(editorInstance, isUpdating)
            }

            const copyURL = () => {
                const URL = window.location.href
                copyToClipboard(URL)
                message.success({
                    content: 'Link Copied!',
                })
            }
            const toggleCustomToolbar = () => {
                showcustomToolBar.value = !showcustomToolBar.value
            }

            /* Watcher for save->unsave */
            // watch(activeInlineTab, (newActiveInlineTab) => {
            //     console.log(
            //         activeInlineTab.value,
            //         newActiveInlineTab,
            //         'compare'
            //     )
            //     if (activeInlineTab.value.isSaved) {
            //         if (
            //             activeInlineTab.value.queryId ===
            //             newActiveInlineTab.queryId
            //         ) {
            //             if (
            //                 !isTwoInlineTabsEqual(
            //                     activeInlineTab.value,
            //                     newActiveInlineTab
            //                 )
            //             ) {
            //                 isUpdateEnabled.value = true
            //             }
            //         }
            //     }
            // })
            return {
                isUpdateEnabled,
                isUpdating,
                showcustomToolBar,
                modalAction,
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                editorInstance,
                activeInlineTab,
                isQueryRunning,
                toggleCustomToolbar,
                copyURL,
                updateQuery,
                openSaveQueryModal,
                saveQuery,
                setInstance,
                run,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
