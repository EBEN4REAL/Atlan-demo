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

            <SaveQueryModal v-model:showSaveQueryModal="showSaveQueryModal" />
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
    import { provideDataInterface } from '~/components/insights/common/composables/useProvide'
    import CustomVariablesNav from '~/components/insights/playground/editor/customVariablesNav/index.vue'
    import { editor } from 'monaco-editor'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
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

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
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
                showSaveQueryModal,
                editorInstance,
                selectedDefaultSchema,
                activeInlineTab,
                isQueryRunning,
                openSaveQueryModal,
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
