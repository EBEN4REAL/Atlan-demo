<template>
    <div class="flex flex-col w-full h-full bg-white">
        <div class="flex text-gray">
            <a-tabs
                v-model:activeKey="activeInlineTabKey"
                :class="$style.inline_tabs"
                hide-add
                type="editable-card"
                class="w-full insights-tabs"
                @change="onTabClick"
                @edit="onEdit"
            >
                <template #tabBarExtraContent>
                    <div class="inline-flex items-center mr-2">
                        <span
                            class="inline-flex items-center justify-center p-2 rounded-full  btn-add hover:bg-gray-300"
                            @click="handleAdd"
                        >
                            <fa icon="fal plus" class="" />
                        </span>
                    </div>
                </template>
                <a-tab-pane v-for="tab in tabs" :key="tab.key" :closable="true">
                    <template #tab>
                        <div
                            class="flex items-center justify-between inline_tab"
                        >
                            <div class="flex items-center">
                                <span
                                    class="
                                        text-sm
                                        truncate
                                        ...
                                        inline_tab_label
                                    "
                                    >{{ tab.label }}</span
                                >
                            </div>
                            <div
                                v-if="!tab.isSaved"
                                class="flex items-center mr-2 unsaved-dot"
                            >
                                <div
                                    class="
                                        w-1.5
                                        h-1.5
                                        rounded-full
                                        bg-primary
                                        -mt-0.5
                                        absolute
                                        right-2.5
                                    "
                                ></div>
                            </div>
                        </div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div v-if="activeInlineTabKey" class="w-full h-full">
            <splitpanes horizontal :push-other-panes="false">
                <pane
                    :max-size="100"
                    :size="100 - paneSize"
                    min-size="45"
                    class="overflow-x-hidden"
                >
                    <Editor
                /></pane>
                <pane min-size="0" :size="paneSize" max-size="55">
                    <ResultsPane
                /></pane>
            </splitpanes>
        </div>
        <NoActiveInlineTab v-else />
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed, Ref, inject, ref } from 'vue'
    import Editor from '~/components/insights/playground/editor/index.vue'
    import ResultsPane from '~/components/insights/playground/resultsPane/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import NoActiveInlineTab from './noActiveInlineTab.vue'
    import useRunQuery from './common/composables/useRunQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import {
        useProvide,
        provideDataInterface,
    } from '~/components/insights/common/composables/useProvide'
    import { useRouter } from 'vue-router'

    // import { useHotKeys } from '~/components/insights/common/composables/useHotKeys'

    export default defineComponent({
        components: { Editor, ResultsPane, NoActiveInlineTab },
        props: {
            activeInlineTabKey: {
                type: String,
                required: true,
            },
        },
        setup(props, { emit }) {
            const router = useRouter()
            const { queryRun, isQueryRunning } = useRunQuery()
            const { inlineTabRemove, inlineTabAdd, setActiveTabKey } =
                useInlineTab()

            // const {resultsPaneSizeToggle} = useHotKeys()
            const paneSize = ref(55)
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const isActiveInlineTabSaved = computed(
                () => activeInlineTab.value.isSaved
            )
            const handleAdd = () => {
                const key = String(new Date().getTime())
                const inlineTabData: activeInlineTabInterface = {
                    label: 'untitled',
                    key,
                    favico: 'https://atlan.com/favicon.ico',
                    isSaved: false,
                    queryId: undefined,
                    status: 'draft',
                    connectionId: '',
                    description: '',
                    qualifiedName: '',
                    isSQLSnippet: false,
                    explorer: {
                        schema: {
                            connectors: {
                                attributeName:
                                    activeInlineTab.value?.explorer?.schema
                                        ?.connectors?.attributeName,
                                attributeValue:
                                    activeInlineTab.value?.explorer?.schema
                                        ?.connectors?.attributeValue,
                            },
                        },
                        queries: {
                            connectors: {
                                connector:
                                    activeInlineTab.value?.explorer?.queries
                                        .connectors.connector,
                            },
                        },
                    },
                    playground: {
                        editor: {
                            text:
                                activeInlineTab.value?.playground?.editor
                                    .text ??
                                'select * from "INSTACART_ALCOHOL_ORDER_TIME" limit 10',
                            dataList: [],
                            columnList: [],
                            variables:
                                activeInlineTab.value?.playground?.editor
                                    .variables ?? [],
                        },
                        resultsPane: {
                            activeTab:
                                activeInlineTab.value?.playground?.resultsPane
                                    ?.activeTab ?? 0,
                            result: {
                                title: `${key} Result`,
                            },
                            metadata: {},
                            queries: {},
                            joins: {},
                            filters: {},
                            impersonation: {},
                            downstream: {},
                            sqlHelp: {},
                        },
                    },
                    assetSidebar: {
                        // for taking the previous state from active tab
                        isVisible:
                            activeInlineTab.value?.assetSidebar?.isVisible ??
                            false,
                        assetInfo: {},
                        title: activeInlineTab.value?.assetSidebar.title ?? '',
                        id: activeInlineTab.value?.assetSidebar.id ?? '',
                    },
                }
                inlineTabAdd(inlineTabData, tabs, activeInlineTabKey)
            }
            const pushGuidToURL = (guid: string | undefined) => {
                if (guid) router.push(`/insights?id=${guid}`)
                else router.push(`/insights`)
            }
            const onTabClick = (activeKey) => {
                setActiveTabKey(activeKey, activeInlineTabKey)
                pushGuidToURL(activeInlineTab.value?.queryId)
            }
            const onEdit = (targetKey: string | MouseEvent, action: string) => {
                if (action === 'add') {
                    handleAdd()
                } else {
                    console.log(targetKey)
                    inlineTabRemove(
                        targetKey as string,
                        tabs,
                        activeInlineTabKey
                    )
                }
            }

            /*---------------------------------------------*/
            /*---------- PROVIDERS FOR CHILDRENS -----------------
                ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
                */
            const provideData: provideDataInterface = {
                isQueryRunning: isQueryRunning,
            }
            useProvide(provideData)

            /*-------------------------------------*/

            return {
                isActiveInlineTabSaved,
                isQueryRunning,
                activeInlineTab,
                tabs,
                activeInlineTabKey,
                paneSize,
                handleAdd,
                onEdit,
                onTabClick,
                queryRun,
            }
        },
    })
</script>
<style lang="less">
    .insights-tabs {
        .ant-tabs-nav-container {
            height: 30px !important;
        }
        .ant-tabs-extra-content {
            line-height: 30px !important;
        }
        .ant-tabs-tab {
            height: 100%;
            border-radius: 0px !important;
            margin-right: 0px !important;
            border-left: 0px !important;
            border-right: 0px !important;
            border-top: 0px !important;
            padding: 0 12px !important;
            height: 30px !important;

            > div {
                height: 100%;
            }

            &.ant-tabs-tab-active {
                border-bottom: 1px solid !important;
            }
            .ant-tabs-close-x {
                visibility: hidden;
                transition: none !important;
            }
            &:hover {
                .unsaved-dot {
                    visibility: hidden;
                }
                .ant-tabs-close-x {
                    visibility: visible !important;
                }
            }
        }
    }
</style>
<style lang="less" scoped>
    .btn {
        border: 1px solid #f06;
        padding: 10px 16px;
        border-radius: 2px;
        border: 1px solid #fff;
        box-shadow: 0 3px 1px -2px #00000033, 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12);
        background-color: #fff;
        user-select: none;
        cursor: pointer;
    }

    .btn + .btn {
        margin-left: 30px;
    }

    .btns {
        padding: 50px 30px;
    }
    .children_spiltpanes {
        height: calc(100vh - 19rem);
    }
    // .inline_tab {
    //     max-width: 4.2rem;
    //     overflow: hidden;
    //     // min-width: 3rem;
    // }
    .inline_tab_label {
        max-width: 5.8rem;
        overflow: hidden;
    }
</style>
<style lang="less" module>
    .inline_tabs {
        :global(.ant-tabs-tab > div) {
            @apply flex items-center !important;
        }
        :global(.ant-tabs-bar) {
            @apply m-0 !important;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
