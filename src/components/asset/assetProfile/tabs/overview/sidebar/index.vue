<template>
    <div class="pt-1">
        <div class="px-5">
            <div class="flex items-start justify-between mt-5 mb-4 text-sm">
                <div v-if="page === 'nonBiOverview'" class="w-full">
                    <div class="flex items-center mb-0.5">
                        <component
                            :is="
                                images[
                                    getDataType(
                                        selectedAsset?.attributes?.dataType
                                    )
                                ]
                            "
                            class="w-4 h-4 mr-1.5 mb-0.5"
                        ></component>
                        <Tooltip
                            :tooltip-text="selectedAsset?.attributes?.name"
                            classes="text-base font-bold text-gray-700 capitalize"
                        />
                    </div>
                    <div class="text-gray-500">
                        {{ getDataType(selectedAsset?.attributes?.dataType) }}
                    </div>
                </div>
                <div v-else class="w-full">
                    <div class="flex items-center mb-0.5">
                        <Tooltip
                            :tooltip-text="selectedAsset?.attributes?.name"
                            classes="text-base font-bold text-gray-700 capitalize"
                        />
                    </div>
                </div>
                <div class="flex">
                    <AtlanBtn color="secondary" size="sm" padding="compact">
                        <template #prefix>
                            <atlan-icon icon="Share" />
                        </template>
                        Share
                    </AtlanBtn>
                    <a-button
                        type="text"
                        class="p-0 ml-3 text-xl"
                        @click="$emit('closeSidebar')"
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
                    :selected-asset="selectedAsset"
                    :page="page"
                    :is-loaded="isLoaded"
                    @change="handleChange"
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        PropType,
        ref,
        Ref,
        provide,
        toRefs,
        watch,
        onMounted,
    } from 'vue'

    import Tooltip from '@common/ellipsis/index.vue'
    import AtlanBtn from '~/components/UI/button.vue'

    import useAssetDetailsTabList from './tabs/useTabList'
    import { images, dataTypeList } from '~/constant/datatype'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'PreviewSidebar',
        components: {
            Tooltip,
            AtlanBtn,
            info: defineAsyncComponent(() => import('./tabs/info/index.vue')),
            chat: defineAsyncComponent(() => import('./tabs/chat/index.vue')),
            activity: defineAsyncComponent(
                () =>
                    import(
                        '~/components/discovery/preview/tabs/activity/activityTab.vue'
                    )
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
        emits: ['closeSidebar', 'assetMutation'],

        setup(props, { emit }) {
            const { selectedAsset, page } = toRefs(props)
            const { filteredTabs } = useAssetDetailsTabList(page, selectedAsset)

            const activeKey = ref(0)
            const isLoaded: Ref<boolean> = ref(true)

            const dataMap: { [id: string]: any } = ref({})
            const handleChange = (value: any) => {}
            const infoTabData: Ref<any> = ref({})

            provide('mutateSelectedAsset', (updatedAsset: assetInterface) => {
                emit('assetMutation', updatedAsset)
            })

            const getDataType = (type: string) => {
                let label = ''
                dataTypeList.forEach((i) => {
                    if (i.type.includes(type)) label = i.label
                })
                return label
            }

            function init() {
                isLoaded.value = false

                infoTabData.value = selectedAsset.value
            }

            watch(() => selectedAsset.value.guid, init)

            watch(page, () => {
                if (activeKey.value > filteredTabs.value.length)
                    activeKey.value = 0
            })

            onMounted(init)

            return {
                isLoaded,
                infoTabData,
                dataMap,
                activeKey,
                filteredTabs,
                handleChange,
                images,
                getDataType,
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
