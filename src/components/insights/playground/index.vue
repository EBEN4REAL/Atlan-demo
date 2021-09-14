<template>
    <div class="flex flex-col w-full h-full bg-white">
        <div class="flex text-gray">
            <vue3-tabs-chrome
                :ref="setTabRef"
                :tabs="tabs"
                v-model="activeInlineTabKey"
                @click="onTabClick"
                @remove="onTabRemove"
                :minWidth="80"
            >
                <template #after>
                    <div class="ml-0">
                        <span
                            class="inline-flex items-center justify-center p-2 rounded-full  btn-add hover:bg-gray-300"
                            @click="handleAdd"
                        >
                            <fa icon="fal plus" class="" />
                        </span>
                    </div>
                </template>
            </vue3-tabs-chrome>
        </div>
        <splitpanes
            horizontal
            :push-other-panes="false"
            v-if="activeInlineTabKey"
        >
            <pane max-size="100" size="50" min-size="50"> <Editor /></pane>
            <pane min-size="0" max-size="50"> <ResultsPane /></pane>
        </splitpanes>
        <NoActiveInlineTab v-else />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        computed,
        Ref,
        inject,
    } from 'vue'
    import Vue3TabsChrome from './vue3-tabs-chrome.vue'
    import Editor from '~/components/insights/playground/editor/index.vue'
    import ResultsPane from '~/components/insights/playground/resultsPane/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import NoActiveInlineTab from './noActiveInlineTab.vue'

    export default defineComponent({
        components: { Editor, ResultsPane, Vue3TabsChrome, NoActiveInlineTab },
        props: {
            tabRef: {
                type: Object as PropType<Ref<any>>,
                required: true,
            },
            activeInlineTabKey: {
                type: String,
                required: true,
            },
        },
        emits: ['update:activeInlineTabKey', 'update:tabRef'],
        setup(props, { emit }) {
            const { activeInlineTabKey, tabRef } = toRefs(props)
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const setTabRef = (el) => {
                emit('update:tabRef', el)
            }
            const handleRemove = () => {
                tabRef.value.removeTab(activeInlineTabKey.value)
            }
            const handleAdd = (tab1, alltabs) => {
                console.log(tab1, tabRef.value.tabs, 'tabs')
                const key = 'tab' + Date.now()
                tabRef.value.addTab({
                    label: 'New Tab',
                    key,
                    favico: 'https://atlan.com/favicon.ico',
                    isSaved: false,
                    queryId: undefined,
                    explorer: {},
                    playground: {
                        editorTitle: `${key} Editor`,
                        resultsPane: {
                            activeTab: 'result',
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
                        isVisible: false,
                        assetInfo: {},
                        title: '',
                        id: '',
                    },
                })
                emit('update:activeInlineTabKey', key)
            }
            const onTabClick = (event, tab, index) => {
                emit('update:activeInlineTabKey', tab.key)
            }
            const onTabRemove = (tab, index) => {
                const tabs = tabRef.value.tabs
                const len = tabs.length
                if (tabs.length > 0) {
                    const activeKey = tabs[len - 1].key
                    emit('update:activeInlineTabKey', activeKey)
                } else {
                    emit('update:activeInlineTabKey', undefined)
                }
            }

            return {
                onTabRemove,
                onTabClick,
                activeInlineTab,
                tabs,
                activeInlineTabKey,
                handleAdd,
                handleRemove,
                setTabRef,
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

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
