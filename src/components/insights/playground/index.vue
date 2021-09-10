<template>
    <div class="flex flex-col flex-1 h-full bg-white">
        <div class="flex py-1.5 px-3 border-b text-gray">
            <vue3-tabs-chrome
                :ref="setTabRef"
                :tabs="tabs"
                v-model:modelValue="tab"
                :minHiddenWidth="120"
            />
            <div class="btns">
                <button class="btn" @click="handleAdd">new Tab</button>
                <button class="btn" @click="handleRemove">
                    Remove Active Tab
                </button>
            </div>
        </div>
        <Editor />
        <div class="flex border-b border-t text-gray py-1.5 px-3">Result</div>
        <Result />
    </div>
</template>

<script lang="ts">
    import { defineComponent, reactive, ref } from 'vue'
    import Vue3TabsChrome from './vue3-chrome-tabs.vue'
    import Editor from '~/components/insights/playground/editor.vue'
    import Result from '~/components/insights/playground/result.vue'
    import 'vue3-tabs-chrome/dist/vue3-tabs-chrome.css'

    export default defineComponent({
        components: { Editor, Result, Vue3TabsChrome },
        props: {},
        setup(props) {
            const tabRef = ref()
            const tab = ref('google')
            const tabs = reactive([
                {
                    label: 'google',
                    key: 'google',
                    favicon: 'https://bing.com/favicon.ico',
                },
                {
                    label: 'facebook',
                    key: 'facebook',
                    favicon: 'https://juejin.cn/favicon.ico',
                },
                {
                    label: 'New Tab',
                    key: 'costom key',
                },
            ])
            const setTabRef = (el) => {
                tabRef.value = el
            }

            const handleAdd = () => {
                const key = 'tab' + Date.now()
                tabRef.value.addTab({
                    label: 'New Tab',
                    key,
                })

                tab.value = key
            }

            const handleRemove = () => {
                tabRef.value.removeTab(tab.value)
            }
            return {
                tabs,
                tab,
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
