<template>
    <div>
        <!-- Search and Filter -->
        <div class="flex items-center w-1/2 mb-4">
            <div class="flex items-center flex-1">
                <a-input-search
                    v-model:value="queryText"
                    placeholder="Search related assets..."
                    class="mr-3"
                    size="default"
                    :allow-clear="true"
                ></a-input-search>

                <a-popover trigger="click" placement="right">
                    <template #content>
                        <a-checkbox-group
                            v-model:value="checkedList"
                            :options="plainOptions"
                            class="flex flex-col"
                        />
                    </template>
                    <a-button class="px-2"
                        ><atlan-icon icon="FilterDot" class="w-auto h-5"
                    /></a-button>
                </a-popover>
            </div>
        </div>

        <!-- Relations tabs -->
        <div>
            <a-tabs
                :active-key="activeKey"
                :class="$style.relationstab"
                @change="selectTab($event)"
            >
                <a-tab-pane
                    v-for="(item, index) in filteredAssets"
                    :key="index"
                >
                    <template #tab>
                        <div class="flex items-center">
                            <span class="capitalize">
                                {{ item.displayText }} </span
                            ><span class="chip">{{ item.length }}</span>
                        </div>
                    </template>

                    <div class="w-full">
                        <AssetTypeItems
                            :projections="checkedList"
                            :asset-type="item.displayText"
                            :asset-id="selectedAsset.guid"
                            :css-classes="cssClasses"
                            page="BiOverview"
                            @preview="handlePreview"
                        />
                    </div>
                </a-tab-pane>
            </a-tabs>
            <div v-if="filteredAssets.length === 0 && !isLoading">
                <img
                    :src="emptyScreen"
                    alt="No assets found"
                    class="w-64 m-auto mt-4"
                />
                <div class="mt-4 text-sm text-center text-gray">
                    No assets found
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        ref,
        onMounted,
        watch,
        inject,
        computed,
    } from 'vue'
    // Components
    import AssetTypeItems from '@/discovery/preview/tabs/relations/assetTypeItems.vue'

    // Composables
    import useEntityRelationships from '~/composables/asset/useEntityRelationships'
    // Assets
    import emptyScreen from '~/assets/images/empty_search.png'

    export default defineComponent({
        components: { AssetTypeItems },
        emits: ['preview'],
        setup(_, context) {
            /** DATA */
            const relationshipAssetTypes = ref([])
            const isLoading = ref(true)
            const plainOptions = ['description', 'owners', 'business terms']
            const checkedList = ref(['description', 'owners'])
            const activeKey = ref(0)
            const queryText = ref('')

            /** INJECTIONS */
            // const assetDataInjection = inject('assetData')

            /** COMPUTED */
            // const assetData = computed(() => assetDataInjection?.asset)
            // store
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)
            
            const filteredAssets = computed(() =>
                relationshipAssetTypes.value.filter(
                    (el) =>
                        el.displayText
                            .toLowerCase()
                            .indexOf(queryText.value.toLowerCase()) !== -1
                )
            )

            /** METHODS */
            // selectTab
            const selectTab = (val: number) => {
                activeKey.value = val
            }
            // fetchData
            const fetchData = () => {
                const { relationshipAssetTypes: x, isLoading: y } =
                    useEntityRelationships(selectedAsset.value.guid)

                watch(y, () => {
                    relationshipAssetTypes.value = x.value
                    isLoading.value = y.value
                })
            }

            // handlePreview
            const handlePreview = (item) => {}

            /** LIFECYCLES */
            onMounted(async () => {
                await fetchData()
            })

            /** WATCHERS */
            watch(selectedAsset, fetchData, { immediate: true })

            return {
                queryText,
                activeKey,
                filteredAssets,
                isLoading,
                plainOptions,
                checkedList,
                // assetData,
                selectedAsset,
                emptyScreen,
                cssClasses: {
                    paddingY: 'py-6',
                    textSize: 'text-base',
                },
                selectTab,
                handlePreview,
            }
        },
    })
</script>

<style scoped>
    .chip {
        @apply px-1 pt-1 pb-0.5 mr-1 ml-3 rounded tracking-wide text-xs font-bold text-primary bg-primary-light;
    }
    :global(.ant-tabs .ant-tabs-right-content) {
        @apply pr-0 !important;
    }
</style>

<style lang="less" module>
    .relationstab {
        :global(.ant-tabs-tab) {
            padding-left: 2px;
            padding-right: 2px;
            @apply pb-5 mr-5 text-gray-500 text-sm tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray font-bold;
        }
        :global(.ant-tabs-bar) {
            @apply mb-5 pl-0;
        }

        :global(.ant-tabs-tabpane) {
            height: auto !important;
            overflow: auto !important;
            @apply pr-0;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 pb-0 !important;
        }
    }
</style>
