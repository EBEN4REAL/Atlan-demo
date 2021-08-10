<template>
    <div class="py-4">
        <div class="px-4">
            <div class="flex items-center justify-between mt-2 mb-4 text-sm">
                <div class="flex">
                    <component
                        :is="selectedAsset.typeName"
                        class="w-5 h-5 mr-2"
                    ></component>
                    <span class="text-gray-description">{{
                        assetTypeLabel(selectedAsset)
                    }}</span>
                </div>
                <div class="flex">
                    <div
                        class="
                            flex
                            px-1.5
                            py-0.5
                            mx-2
                            _bg-primary-light
                            rounded
                        "
                    >
                        <fa class="text-xs text-primary" icon="fal bookmark" />
                    </div>
                    <div
                        class="
                            flex
                            px-1.5
                            py-0.5
                            mx-2
                            _bg-primary-light
                            rounded
                        "
                    >
                        <span class="flex mr-2"
                            ><fa class="text-xs text-primary" icon="fal share"
                        /></span>
                        <span class="text-sm text-primary">Share</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center mb-3">
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
            <HierarchyBar class="mb-4" :selectedAsset="selectedAsset" />
        </div>
        <a-tabs v-model:activeKey="activeKey" :class="$style.previewtab">
            <a-tab-pane
                class="px-4 py-2 overflow-y-auto tab-height"
                v-for="tab in tabs"
                :key="tab.id"
                :tab="tab.name"
            >
                <component
                    :is="tab.component"
                    :ref="
                        (el) => {
                            refMap[tab.id] = el
                        }
                    "
                    :componentData="dataMap[tab.id]"
                    :infoTabData="infoTabData"
                    :selectedAsset="selectedAsset"
                    :isLoaded="isLoaded"
                    @change="handleChange"
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        defineAsyncComponent,
        Ref,
        onMounted,
        watch,
        toRefs,
    } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { tabList as tabs } from './tabList'
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import useAsset from '~/composables/asset/useAsset'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: {
            StatusBadge,
            HierarchyBar,
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
            const { assetTypeLabel, title } = useAssetInfo()
            const { selectedAsset } = toRefs(props)
            const isLoaded: Ref<boolean> = ref(true)

            const activeKey = ref('1')
            const refMap: { [key: string]: any } = ref({})
            const dataMap: { [id: string]: any } = ref({})
            const handleChange = (value: any) => {}
            const infoTabData: Ref<any> = ref({})

            function getAssetEntitity(data: Ref): any {
                if (data.value?.entities.length > 0)
                    return data.value?.entities[0]
                return {}
            }

            function init() {
                isLoaded.value = true
                const { data, error } = useAsset({
                    entityId: selectedAsset.value.guid,
                })
                watch([data, error], () => {
                    if (data.value && error.value == undefined) {
                        const entitiy = getAssetEntitity(data)
                        infoTabData.value = entitiy
                        isLoaded.value = false
                        console.log(infoTabData.value, 'info tab Data')
                    } else {
                        console.log(
                            error.value,
                            '------ assetInfo failed to fetch ------ '
                        )
                    }
                })
            }
            watch(selectedAsset, init)
            onMounted(init)

            return {
                isLoaded,
                infoTabData,
                title,
                assetTypeLabel,
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
    .tab-height {
        height: calc(100vh - 14rem);
    }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-tab) {
            @apply pb-2 px-1;
            @apply mx-2;
            @apply text-gray-description;
            @apply text-sm;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-2;
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
        }
    }
</style>
