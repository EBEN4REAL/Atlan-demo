<template>
    <div class="w-full h-full px-3 rounded">
        <div class="w-full h-full overflow-x-hidden rounded">
            <div class="flex items-center justify-between w-full my-2">
                <div class="flex items-center text-base">
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
                            {&nbsp;}
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="flex mr-4 text-sm">
                        <a-button
                            type="primary"
                            class="flex items-center py-0.5 shadow"
                            :class="
                                isQueryRunning === 'loading' ? 'px-4.5' : 'px-3'
                            "
                            :loading="
                                isQueryRunning === 'loading' ? true : false
                            "
                            @click="run"
                        >
                            <template #icon>
                                <AtlanIcon
                                    class="mr-0.5 text-white"
                                    icon="Play"
                                />
                            </template>
                            Run</a-button
                        >
                        <a-button
                            v-if="activeInlineTab.queryId"
                            class="
                                flex
                                items-center
                                justify-between
                                ml-2
                                py-0.5
                                shadow
                            "
                            :loading="isUpdating"
                            :class="isUpdating ? 'px-4.5' : 'px-3'"
                            :disabled="
                                activeInlineTab.queryId &&
                                activeInlineTab.isSaved
                            "
                            @click="updateQuery"
                        >
                            <template #icon>
                                <AtlanIcon class="mr-0.5" icon="Save" />
                            </template>

                            Update
                        </a-button>
                        <a-button
                            v-else
                            class="
                                flex
                                items-center
                                justify-between
                                ml-2
                                py-0.5
                                shadow
                            "
                            @click="openSaveQueryModal"
                        >
                            <template #icon>
                                <AtlanIcon class="" icon="Save" />
                            </template>

                            Save
                        </a-button>
                        <a-button
                            class="flex items-center ml-2 py-0.5 px-3 shadow"
                            @click="copyURL"
                        >
                            <AtlanIcon class="mr-0.5" icon="Share" /><span
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
        ComputedRef,
        toRaw,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '../common/composables/useRunQuery'
    import CustomVariablesNav from '~/components/insights/playground/editor/customVariablesNav/index.vue'
    import ThreeDotMenu from '~/components/insights/playground/editor/threeDotMenu/index.vue'
    import { editor } from 'monaco-editor'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message } from 'ant-design-vue'
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
            const { modifyActiveInlineTabEditor } = useInlineTab()
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
            const { updateSavedQuery, saveQueryToDatabase } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const isUpdating: Ref<boolean> = ref(false)
            const openSaveQueryModal = () => {
                showSaveQueryModal.value = true
            }

            // callback fxn
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
            const saveQuery = (saveQueryData: any) => {
                saveQueryToDatabase(
                    saveQueryData,
                    editorInstance,
                    saveQueryLoading,
                    showSaveQueryModal,
                    saveModalRef,
                    router
                )
            }
            return {
                isUpdating,
                showcustomToolBar,
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
