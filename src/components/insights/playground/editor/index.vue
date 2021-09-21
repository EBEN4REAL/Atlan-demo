<template>
    <div class="w-full h-full px-3 rounded">
        <div class="w-full h-full overflow-x-hidden rounded">
            <CustomVariablesNav />
            <div
                class="flex items-center justify-between w-full mb-3  run-btn-wrapper"
            >
                <div class="w-full">
                    <p class="mb-1 text-base">
                        {{ selectedDefaultSchema ?? 'ATLAN_TRIAL.PUBLIC' }}
                    </p>
                </div>
                <a-button
                    type="primary"
                    class=""
                    :loading="isQueryRunning === 'loading' ? true : false"
                    @click="run"
                    >Run Query</a-button
                >
            </div>
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
        reactive,
        computed,
        provide,
        watch,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '../common/composables/useRunQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useProvide } from '~/components/insights/common/composables/useProvide'
    import { provideDataInterface } from '~/components/insights/common/composables/useProvide'
    import CustomVariablesNav from '~/components/insights/playground/editor/customVariablesNav/index.vue'
    import { editor } from 'monaco-editor'

    export default defineComponent({
        components: {
            Monaco: defineAsyncComponent(() => import('./monaco/monaco.vue')),
            CustomVariablesNav,
        },
        props: {},
        setup() {
            const { queryRun } = useRunQuery()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const selectedDefaultSchema = computed(
                () =>
                    activeInlineTab.value.explorer.schema.connectors
                        .selectedDefaultSchema
            )

            let editorInstance: any = reactive({})
            const monacoInstance = ref()
            const isQueryRunning = inject('isQueryRunning') as Ref<string>

            const getData = (dataList, columnList) => {
                // setting the data here because we don't want to save the response in local storage
                activeInlineTab.value.playground.editor.dataList = dataList
                activeInlineTab.value.playground.editor.columnList = columnList
            }
            const run = () => {
                queryRun(activeInlineTab.value, getData, isQueryRunning)
            }

            const setEditorInstance = (
                editorInstanceParam: editor.IStandaloneCodeEditor
            ) => {
                editorInstance = editorInstanceParam
                console.log(editorInstanceParam, 'fxn')
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
                selectedDefaultSchema,
                activeInlineTab,
                isQueryRunning,
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
