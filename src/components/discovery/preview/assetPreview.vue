<template>
    <div class="pt-1">
        <div v-if="page === 'discovery'" class="px-5">
            <div class="flex items-center justify-between mt-2 mb-4 text-sm">
                <!-- <component
                    :is="selectedAsset.typeName"
                    class="w-auto h-8"
                ></component> -->
                <AssetLogo :asset="selectedAsset" variant="lg" />

                <div class="flex">
                    <div class="icon-btn">
                        <AtlanIcon icon="BookmarkOutlined" />
                    </div>
                    <div class="icon-btn">
                        <AtlanIcon class="mr-2" icon="Share" />
                        <span class="text-sm">Share</span>
                    </div>
                </div>
            </div>
            <div class="flex items-center pb-1">
                <Tooltip
                    :tooltip-text="title(selectedAsset)"
                    classes="mb-0 text-lg font-bold text-gray"
                />

                <div class="flex items-center">
                    <StatusBadge
                        :key="selectedAsset.guid"
                        :show-no-status="false"
                        :status-id="selectedAsset?.attributes?.assetStatus"
                        class="ml-1.5"
                    ></StatusBadge>
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
                    :selected-asset="selectedAsset"
                    :is-loaded="isLoaded"
                    @change="handleChange"
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import {
        defineAsyncComponent,
        defineComponent,
        onMounted,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
        provide,
    } from 'vue'
    import useAsset from '~/composables/asset/useAsset'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetDetailsTabList from '../../discovery/preview/tabs/useTabList'

    export default defineComponent({
        name: 'AssetPreview',
        components: {
            Tooltip,
            AssetLogo,
            StatusBadge,
            info: defineAsyncComponent(() => import('./tabs/info/infoTab.vue')),
            columns: defineAsyncComponent(
                () => import('./tabs/columns/columnTab.vue')
            ),
            activity: defineAsyncComponent(
                () => import('./tabs/activity/activityTab.vue')
            ),
            chat: defineAsyncComponent(
                () => import('./tabs/chat/assetChat.vue')
            ),
            relations: defineAsyncComponent(
                () => import('./tabs/relations/relationTab.vue')
            ),
            actions: defineAsyncComponent(
                () => import('./tabs/actions/actions.vue')
            ),
            lineage: defineAsyncComponent(
                () => import('./tabs/lineage/lineageTab.vue')
            ),
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            page: {
                type: String,
                required: true,
            },
        },
        emits: ['assetMutation'],
        setup(props, { emit }) {
            const { selectedAsset, page } = toRefs(props)
            const { filteredTabs, assetType } = useAssetDetailsTabList(page)
            const { assetTypeLabel, title, assetStatus } = useAssetInfo()
            const activeKey = ref(0)
            const isLoaded: Ref<boolean> = ref(true)

            const dataMap: { [id: string]: any } = ref({})
            const handleChange = () => {}
            const infoTabData: Ref<any> = ref({})

            function getAssetEntitity(data: Ref): any {
                if (data.value?.entities.length > 0)
                    return data.value?.entities[0]
                return {}
            }

            provide('mutateSelectedAsset', (updatedAsset: assetInterface) => {
                emit('assetMutation', updatedAsset)
            })

            watch(page, () => {
                if (activeKey.value > filteredTabs.value.length)
                    activeKey.value = 0
            })

            function init() {
                isLoaded.value = false
                // const { data, error } = useAsset({
                //     entityId: selectedAsset.value.guid,
                // })
                // assetType.value = selectedAsset.value.typeName
                // watch([data, error], () => {
                //     if (data.value && error.value === undefined) {
                //         const entitiy = getAssetEntitity(data)
                //         infoTabData.value = entitiy
                //         isLoaded.value = false
                //         console.log(infoTabData.value, 'info tab Data')
                //     } else {
                //         console.log(
                //             error.value,
                //             '------ assetInfo failed to fetch ------ '
                //         )
                //     }
                // })
                infoTabData.value = selectedAsset.value
            }
            watch(() => selectedAsset.value.guid, init)
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
        max-height: calc(100vh - 12rem);
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
