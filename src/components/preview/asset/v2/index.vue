<template>
    <div class="px-4 py-4">
        <div class="flex items-center justify-between text-sm mb-3.5">
            <div class="flex">
                <component
                    :is="selectedAsset.typeName"
                    class="w-5 h-5 mr-2"
                ></component>
                <span class="text-gray-description">Table</span>
            </div>
            <div class="flex">
                <div class="flex px-1.5 py-0.5 mx-2 _bg-primary-light rounded">
                    <fa class="text-xs text-primary" icon="fal bookmark" />
                </div>
                <div class="flex px-1.5 py-0.5 mx-2 _bg-primary-light rounded">
                    <span class="flex mr-2"
                        ><fa class="text-xs text-primary" icon="fal share"
                    /></span>
                    <span class="text-sm text-primary">Share</span>
                </div>
            </div>
        </div>
        <div class="flex items-center mb-2">
            <span class="mb-0 text-lg text-gray font-bold truncate ...">
                {{ title(selectedAsset) }}</span
            >
            <div class="flex items-center">
                <StatusBadge
                    :key="selectedAsset.guid"
                    :status-id="selectedAsset?.attributes?.assetStatus"
                    class="ml-1.5"
                ></StatusBadge>
            </div>
        </div>
        <div class="flex mb-4">
            <div class="flex items-center text-xs tracking-wider">
                <img :src="logo(selectedAsset)" class="w-auto h-4 mr-1" />{{
                    integrationName(selectedAsset)
                }}
            </div>
        </div>
        <div class="">
            <a-tabs v-model:activeKey="activeKey" :class="$style.previewtab">
                <a-tab-pane v-for="tab in tabs" :key="tab.id" :tab="tab.name">
                    <component
                        :is="tab.component"
                        :ref="
                            (el) => {
                                refMap[tab.id] = el
                            }
                        "
                        :componentData="dataMap[tab.id]"
                        :selectedAsset="selectedAsset"
                        @change="handleChange"
                    ></component>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, defineAsyncComponent } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetMixin from '~/mixins/asset'
    import { tabList as tabs } from './tabList'

    export default defineComponent({
        mixins: [AssetMixin],

        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: {
            StatusBadge,
            info: defineAsyncComponent(() => import('./tabs/info/index.vue')),
            columns: defineAsyncComponent(
                () => import('./tabs/columns/index.vue')
            ),
            activity: defineAsyncComponent(
                () => import('./tabs/activity/index.vue')
            ),
            chat: defineAsyncComponent(() => import('./tabs/chat/index.vue')),
            actions: defineAsyncComponent(
                () => import('./tabs/actions/index.vue')
            ),
            lineage: defineAsyncComponent(
                () => import('./tabs/lineage/index.vue')
            ),
        },
        setup(props, { emit }) {
            const activeKey = ref('1')
            const refMap: { [key: string]: any } = ref({})
            const dataMap: { [id: string]: any } = ref({})
            const handleChange = (value: any) => {}

            return {
                dataMap,
                activeKey,
                tabs,
                refMap,
                handleChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-tab) {
            padding: 8px 12px !important;
            margin-right: 0px !important;
            @apply text-gray-description;
            @apply text-xs;
        }
        :global(.ant-tabs-bar) {
            margin-bottom: 0px;
        }
        :global(.ant-tabs-content) {
            padding-right: 0px;
        }
    }
</style>
