<template>
    <div class="pt-1">
        <div class="px-5">
            <div class="flex items-start justify-between mt-5 mb-4 text-sm">
                <div class="w-full">
                    <Tooltip
                        :tooltip-text="selectedRow?.column_name"
                        classes="mb-0.5 text-base font-bold text-gray-700 capitalize"
                    />
                    <div class="text-gray-500">Column</div>
                </div>
                <div class="flex">
                    <a-button class="flex items-center mr-4"
                        ><atlan-icon icon="Share" class="w-auto h-4 mr-2" />
                        <span class="mt-1 text-sm">Share</span></a-button
                    >
                    <a-button
                        type="text"
                        class="p-0 text-xl"
                        @click="$emit('closeColumnSidebar')"
                        ><fa icon="fal times"></fa
                    ></a-button>
                </div>
            </div>
        </div>
        <a-tabs v-model:activeKey="activeKey" :class="$style.previewtab">
            <a-tab-pane
                v-for="(tab, index) in filteredTabs"
                :key="index"
                class="px-4 pb-4 overflow-y-auto tab-height"
                :tab="tab.name"
            >
                <component
                    :is="tab.component"
                    :component-data="dataMap[tab.id]"
                    :info-tab-data="infoTabData"
                    :selected-row="selectedRow"
                    :is-loaded="isLoaded"
                    @change="handleChange"
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import Tooltip from '@common/ellipsis/index.vue'
    import {
        defineAsyncComponent,
        defineComponent,
        PropType,
        ref,
        Ref,
    } from 'vue'
    import useColumnDetailsTabList from './tabs/useTabList'

    export default defineComponent({
        name: 'ColumnPreview',
        components: {
            Tooltip,
            info: defineAsyncComponent(() => import('./tabs/info/index.vue')),
            chat: defineAsyncComponent(() => import('./tabs/chat/index.vue')),
        },
        props: {
            selectedRow: {
                type: Object as PropType<any>,
                required: true,
            },
        },
        emits: ['closeColumnSidebar'],

        setup() {
            const { filteredTabs } = useColumnDetailsTabList()
            const activeKey = ref(0)
            const isLoaded: Ref<boolean> = ref(true)

            const dataMap: { [id: string]: any } = ref({})
            const handleChange = (value: any) => {}
            const infoTabData: Ref<any> = ref({})

            return {
                isLoaded,
                infoTabData,
                dataMap,
                activeKey,
                filteredTabs,
                handleChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tab-height {
        max-height: calc(100vh - 12rem);
    }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-tab) {
            padding-left: 2px;
            padding-right: 2px;
            @apply pb-5;
            @apply mr-5;
            @apply text-gray-500;
            @apply text-sm !important;
            @apply tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-5;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray;
            @apply font-bold;
        }
        :global(.ant-tabs-bar) {
            margin-bottom: 0px;
        }
        :global(.ant-tabs-content) {
            padding-right: 0px;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
        }
    }
</style>
