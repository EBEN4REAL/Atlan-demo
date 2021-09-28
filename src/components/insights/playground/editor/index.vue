<template>
    <div class="w-full h-full px-3 rounded">
        <div class="w-full h-full overflow-x-hidden rounded">
            <CustomVariablesNav v-if="editorInstance" />
            <div
                class="flex items-center justify-between w-full mb-3  run-btn-wrapper"
            >
                <div class="w-full">
                    <p class="mb-1 text-base">
                        {{ selectedDefaultSchema ?? 'ATLAN_TRIAL.PUBLIC' }}
                    </p>
                </div>
                <div class="flex">
                    <a-button
                        type="primary"
                        class=""
                        :loading="isQueryRunning === 'loading' ? true : false"
                        @click="run"
                        >Run</a-button
                    >
                    <a-button
                        class="flex items-center justify-between ml-4"
                        @click="openSaveQueryModal"
                    >
                        Save
                    </a-button>
                </div>
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
    import { useProvide } from '~/components/insights/common/composables/useProvide'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { provideDataInterface } from '~/components/insights/common/composables/useProvide'
    import CustomVariablesNav from '~/components/insights/playground/editor/customVariablesNav/index.vue'
    import { editor } from 'monaco-editor'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
    import { generateUUID } from '~/utils/helper/generator'
    import whoami from '~/composables/user/whoami'
    import { Insights } from '~/services/atlas/api/insights'
    import { message } from 'ant-design-vue'

    export default defineComponent({
        components: {
            Monaco: defineAsyncComponent(() => import('./monaco/monaco.vue')),
            CustomVariablesNav,
            SaveQueryModal,
        },
        props: {},
        setup() {
            const { queryRun } = useRunQuery()
            const { modifyActiveInlineTabEditor } = useInlineTab()
            const { getConnectonName } = useConnector()
            const { username } = whoami()
            const saveModalRef = ref()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const saveQueryLoading = ref(false)
            const selectedDefaultSchema = computed(
                () =>
                    activeInlineTab.value.explorer.schema.connectors
                        .selectedDefaultSchema
            )

            let editorInstance: Ref<editor.IStandaloneCodeEditor | undefined> =
                ref()
            let monacoInstance: Ref<editor.IStandaloneCodeEditor | undefined> =
                ref()
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const openSaveQueryModal = () => {
                showSaveQueryModal.value = true
            }
            const saveQuery = async (saveQueryData: any) => {
                const uuidv4 = generateUUID()
                const integrationName =
                    activeInlineTab.value.explorer.schema.connectors
                        .connector ?? 'snowflake'
                const connectionQualifiedName =
                    activeInlineTab.value.explorer.schema.connectors
                        .connection ?? 'default/snowflake/vqaqufvr-i'
                const connectionGuid =
                    activeInlineTab.value.explorer.schema.connectors
                        .connectionGuid
                const connectionName = getConnectonName(connectionQualifiedName)
                const name =
                    saveQueryData.title === '' ? uuidv4 : saveQueryData.title
                const description = saveQueryData.description
                const assetStatus = saveQueryData.assetStatus
                const isSQLSnippet = saveQueryData.isSQLSnippet
                const editorInstanceRaw = toRaw(editorInstance.value)
                const rawQuery = editorInstanceRaw?.getValue()
                const compiledQuery = editorInstanceRaw?.getValue()
                const qualifiedName = `${connectionQualifiedName}/query/user/nitya/${uuidv4}`

                const body = ref({
                    entity: {
                        typeName: 'Query',
                        attributes: {
                            integrationName,
                            name,
                            connectionName,
                            qualifiedName,
                            assetStatus,
                            isSnippet: isSQLSnippet,
                            connectionQualifiedName,
                            description,
                            owner: username.value,
                            tenantId: 'default',
                            rawQuery,
                            compiledQuery,
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
                console.log(body.value)
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
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                editorInstance,
                selectedDefaultSchema,
                activeInlineTab,
                isQueryRunning,
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
