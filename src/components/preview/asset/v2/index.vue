<template>
    <div class="pt-6">
        <div class="px-5">
            <div class="flex items-center justify-between mt-2 mb-4 text-sm">
                <component
                    :is="selectedAsset.typeName"
                    class="w-auto h-8"
                ></component>
                <div class="flex">
                    <div class="icon-btn">
                        <fa class="w-auto h-4" icon="fal bookmark" />
                    </div>
                    <div class="icon-btn">
                        <fa class="mr-2 text-sm" icon="fal share" />
                        <span class="text-sm">Share</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center pb-1">
                <span class="mb-0 text-lg text-gray font-bold truncate ...">
                    {{ title(selectedAsset) }}</span
                >

                <div class="flex items-center">
                    <StatusBadge
                        :showNoStatus="true"
                        :key="selectedAsset.guid"
                        :status-id="selectedAsset?.attributes?.assetStatus"
                        class="ml-1.5"
                    ></StatusBadge>
                </div>
            </div>
        </div>
        <a-tabs v-model:activeKey="activeKey" :class="$style.previewtab">
            <a-tab-pane
                class="px-4 pb-4 overflow-y-auto tab-height"
                v-for="(tab, index) in filteredTabs"
                :key="index"
                :tab="tab.name"
            >
                <component
                    :is="tab.component"
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
    import useAssetDetailsTabList from './useTabList'
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
            const { filteredTabs, assetType } = useAssetDetailsTabList()
            const { assetTypeLabel, title, assetStatus } = useAssetInfo()
            const { selectedAsset } = toRefs(props)
            const activeKey = ref(0)
            const isLoaded: Ref<boolean> = ref(true)

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
                assetType.value = selectedAsset.value.typeName
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
                filteredTabs,
                assetStatus,
                handleChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tab-height {
        height: calc(100vh - 14rem);
    }
    .icon-btn {
        @apply flex;
        @apply py-2 ml-2 px-3;
        @apply rounded;
        @apply text-gray;
        @apply border border-gray-300;
        @apply cursor-pointer;
        @apply hover:bg-gray-100;
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
