<template>
    <div class="flex flex-col w-full h-full bg-white">
        <div class="flex text-gray">
            <a-tabs
                v-model:activeKey="activeInlineTabKey"
                :class="$style.inline_tabs"
                hide-add
                type="editable-card"
                class="w-full"
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
                        <div class="flex items-center justify-between">
                            <img
                                :src="tab.favico"
                                class="w-4 h-4 mr-2 rounded"
                                v-if="tab?.favico"
                            />
                            <span class="mr-2">{{ tab.label }}</span>
                        </div>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>
        <div class="w-full h-full" v-if="activeInlineTabKey">
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
    import {
        defineComponent,
        PropType,
        provide,
        toRefs,
        Ref,
        inject,
        ref,
    } from 'vue'
    import Editor from '~/components/insights/playground/editor/index.vue'
    import ResultsPane from '~/components/insights/playground/resultsPane/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import NoActiveInlineTab from './noActiveInlineTab.vue'
    import useRunQuery from './common/composables/useRunQuery'
    import { useMagicKeys, whenever } from '@vueuse/core'

    export default defineComponent({
        components: { Editor, ResultsPane, NoActiveInlineTab },
        props: {
            activeInlineTabKey: {
                type: String,
                required: true,
            },
        },
        emits: ['update:activeInlineTabKey', 'update:tabRef'],
        setup(props, { emit }) {
            const {
                queryRun,
                isQueryRunning,
                dataList: queryDataList,
                columnList: queryColumnList,
            } = useRunQuery()
            const { arrowup } = useMagicKeys()
            const paneSize = ref(45)
            const { activeInlineTabKey } = toRefs(props)
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            /*       
                @params - inlineTabKey: string
             */
            const inlineTabRemove = inject('inlineTabRemove') as Function
            const inlineTabAdd = inject('inlineTabAdd') as Function

            const handleAdd = () => {
                const key = String(tabs.value.length + 1)
                const inlineTabData: activeInlineTabInterface = {
                    label: 'New Tab',
                    key,
                    favico: 'https://atlan.com/favicon.ico',
                    isSaved: false,
                    queryId: undefined,
                    explorer: {},
                    playground: {
                        editor: {
                            text: 'SELECT * from superstore_sales_data_2016-present',
                        },
                        resultsPane: {
                            activeTab:
                                activeInlineTab.value.playground.resultsPane
                                    .activeTab ?? 0,
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
                        isVisible: activeInlineTab.value.assetSidebar.isVisible,
                        assetInfo: {},
                        title: activeInlineTab.value.assetSidebar.title,
                        id: activeInlineTab.value.assetSidebar.id,
                    },
                }
                inlineTabAdd(inlineTabData)
            }
            const onTabClick = (activeKey) => {
                emit('update:activeInlineTabKey', activeKey)
            }
            const onEdit = (targetKey: string | MouseEvent, action: string) => {
                if (action === 'add') {
                    handleAdd()
                } else {
                    inlineTabRemove(targetKey as string)
                }
            }
            /*---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */

            // properties
            provide('isQueryRunning', isQueryRunning)
            provide('queryDataList', queryDataList)
            provide('queryColumnList', queryColumnList)

            // functions
            provide('queryRun', queryRun)

            /*-------------------------------------*/

            /* HOT KEYS */
            whenever(arrowup, () => {
                if (paneSize.value == 0) paneSize.value = 45
                else paneSize.value = 0
            })

            return {
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
<style lang="less" scoped>
    .btn {
        border: 1px solid #f06;
        padding: 10px 16px;
        border-radius: 2px;
        border: 1px solid #fff;
        box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
            0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
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
</style>
<style lang="less" module>
    .inline_tabs {
        :global(.ant-tabs-tab > div) {
            @apply flex items-center !important;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
