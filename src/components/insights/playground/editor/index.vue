<template>
    <div class="w-full h-full px-3 rounded">
        <div class="w-full h-full overflow-x-hidden rounded">
            <CustomVariablesNav v-if="editorInstance" />
            <div class="flex items-center justify-end w-full run-btn-wrapper">
                <!-- <div class="w-full">
                    <p class="mb-1 text-base">
                        {{ activeInlineTab.label ?? 'ATLAN_TRIAL.PUBLIC' }}
                    </p>
                </div> -->
                <div class="flex mr-4 text-sm">
                    <a-button
                        type="primary"
                        class="flex items-center py-0.5 px-2 shadow"
                        :loading="isQueryRunning === 'loading' ? true : false"
                        @click="run"
                    >
                        <AtlanIcon class="mr-1" icon="Play" />
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
                        @click="updateSavedQuery"
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
                </div>
            </div>

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
            <Monaco @editorInstance="setEditorInstance" />
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
        ComputedRef,
        reactive,
        computed,
        provide,
        watch,
        toRaw,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '../common/composables/useRunQuery'
    import {
        useProvide,
        provideDataInterface,
    } from '~/components/insights/common/composables/useProvide'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import CustomVariablesNav from '~/components/insights/playground/editor/customVariablesNav/index.vue'
    import { editor } from 'monaco-editor'
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

    export default defineComponent({
        components: {
            Monaco: defineAsyncComponent(() => import('./monaco/monaco.vue')),
            CustomVariablesNav,
            SaveQueryModal,
            AtlanBtn,
        },
        props: {},
        setup() {
            const { queryRun } = useRunQuery()
            const { getParsedQuery } = useEditor()
            const { modifyActiveInlineTabEditor, modifyActiveInlineTab } =
                useInlineTab()
            const {
                getConnectorName,
                getConnectionQualifiedName,
                getSchemaQualifiedName,
            } = useConnector()
            const { username } = whoami()
            const saveModalRef = ref()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const saveQueryLoading = ref(false)
            const modalAction: ComputedRef<string> = computed(() =>
                activeInlineTab.value.isSaved ? 'UPDATE' : 'CREATE'
            )

            const editorInstance: Ref<
                editor.IStandaloneCodeEditor | undefined
            > = ref()
            const monacoInstance: Ref<
                editor.IStandaloneCodeEditor | undefined
            > = ref()
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            const showSaveQueryModal: Ref<boolean> = ref(false)
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
                                guid: '4a5e319c-4ebd-46e1-9dc4-dcb5e7b06aa3',
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

            const setEditorInstance = (
                editorInstanceParam: editor.IStandaloneCodeEditor,
                monacoInstanceParam?: any
            ) => {
                editorInstance.value = editorInstanceParam
                if (monacoInstanceParam)
                    monacoInstance.value = monacoInstanceParam
                console.log(editorInstanceParam, editorInstance, 'fxn')
            }
            const updateSavedQuery = () => {}

            const copyURL = () => {
                const URL = window.location.href
                copyToClipboard(URL)
                message.success({
                    content: 'Link Copied!',
                })
            }

            /*---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */
            const provideData: provideDataInterface = {
                editorInstance: editorInstance,
                monacoInstance: monacoInstance,
            }
            useProvide(provideData)
            /*-------------------------------------*/
            return {
                modalAction,
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                editorInstance,
                activeInlineTab,
                isQueryRunning,
                copyURL,
                updateSavedQuery,
                openSaveQueryModal,
                saveQuery,
                setEditorInstance,
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
