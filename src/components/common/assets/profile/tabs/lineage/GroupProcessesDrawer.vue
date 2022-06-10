<template>
    <teleport to="#overAssetSidebar">
        <div>
            <a-drawer
                v-if="visible"
                :key="data?.guid"
                v-model:visible="visible"
                placement="right"
                :push="false"
                :get-container="false"
                :class="$style.drawerStyles"
                :closable="false"
                :style="{ position: 'absolute' }"
                :width="420"
                @close="$emit('closeDrawer')"
            >
                <div class="px-5 py-2 pt-4 flex items-center border-b">
                    <div
                        class="flex items-center justify-center p-2 border rounded"
                    >
                        <atlan-icon icon="Code" class="h-4" />
                    </div>
                    <div class="flex flex-col ml-2">
                        <span class="text-gray-700 font-bold text-base"
                            >All Process</span
                        >
                        <span class="text-gray-500"
                            >{{ totalCount }} process</span
                        >
                    </div>
                </div>
                <div class="mx-5 pb-0 border-b mt-2">
                    <SearchAdvanced
                        v-model:value="queryText"
                        :autofocus="true"
                        :placeholder="`Search ${totalCount} process`"
                        @change="handleSearchChange"
                    >
                        <template #postFilter>
                            <div style="max-width: 330px">
                                <PreferenceSelector
                                    v-model="preference.display"
                                    @change="handleDisplayChange"
                                />
                            </div>
                        </template>
                    </SearchAdvanced>
                </div>

                <div
                    v-if="isLoading"
                    class="flex items-center justify-center flex-grow"
                >
                    <AtlanLoader class="h-10" />
                </div>
                <div
                    v-if="!isLoading && error"
                    class="flex items-center justify-center flex-grow"
                >
                    <ErrorView></ErrorView>
                </div>
                <div
                    v-else-if="
                        (list?.length === 0 ||
                            groupedProcessIds?.length === 0) &&
                        !isLoading
                    "
                    class="flex-grow flex items-center justify-center mt-24"
                >
                    <EmptyView
                        empty-screen="NoAssetsFound"
                        image-class="h-44"
                        desc="No related assets found"
                    ></EmptyView>
                </div>
                <!-- {{ list }} -->
                <AssetList
                    v-else
                    :list="list"
                    :is-load-more="isLoadMore"
                    :is-loading="isValidating"
                    @loadMore="handleLoadMore"
                >
                    <template #default="{ item, itemIndex }">
                        <AssetItem
                            ref="assetItemRef"
                            :item="item"
                            :item-index="itemIndex"
                            :preference="preference"
                            :enable-sidebar-drawer="false"
                            :asset-name-truncate-percentage="'80%'"
                            class="px-2 hover:bg-primary-menu text-primary cursor-pointer"
                            @click="handleItemClick(item, itemIndex)"
                            isCompact
                        ></AssetItem>
                    </template>
                </AssetList>
            </a-drawer>
        </div>
    </teleport>
    <AssetDrawer
        :watchGuid="true"
        :guid="selectedAssetDrawerGuid"
        :show-drawer="showAssetSidebarDrawer"
        @closeDrawer="handleCloseDrawer"
        @update="updateCurrentList"
    />
</template>

<script lang="ts">
    // utilities
    import {
        defineComponent,
        toRefs,
        ref,
        watch,
        provide,
        computed,
        onMounted,
    } from 'vue'
    import { debouncedWatch, useDebounceFn, whenever } from '@vueuse/core'

    // composables
    import useAssetStore from '~/store/asset'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    // types and constants
    import { assetInterface } from '~/types/assets/asset.interface'
    import {
        DefaultRelationAttributes,
        MinimalAttributes,
    } from '~/constant/projection'

    // components
    import ErrorView from '@/common/error/discover.vue'
    import EmptyView from '@/common/empty/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'

    export default defineComponent({
        name: 'GroupProcessesDrawer',
        components: {
            ErrorView,
            EmptyView,
            AssetDrawer,
            SearchAdvanced,
            PreferenceSelector,
            AssetList,
            AssetItem,
        },
        props: {
            groupedProcessIds: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emit: ['closeDrawer'],
        setup(props, { emit }) {
            // data
            const { groupedProcessIds } = toRefs(props)
            const visible = ref<boolean>(false)
            const selectedType = ref<String>('Process')
            const discoveryStore = useAssetStore()
            const limit = ref<Number>(20)
            const offset = ref<Number>(0)
            const queryText = ref<String>('')
            const facets = ref({})
            const assetItemRef = ref(null)
            const currentIndex = ref<number>(0)
            const selectedAssetDrawerGuid = ref('')
            const showAssetSidebarDrawer = ref(false)

            const aggregations = ref<String[]>(['typeName'])

            const postFacets = computed(() => ({
                typeName: selectedType.value,
            }))

            const dependentKey = ref<String | null>(null)

            const defaultAttributes = ref<String[]>([...MinimalAttributes])
            const preference = ref({ sort: 'default', display: [] })
            const relationAttributes = ref<String[]>([
                ...DefaultRelationAttributes,
            ])

            // methods
            const updateFacet = () => {
                facets.value = {}
                facets.value.guidList = groupedProcessIds.value
            }

            if (discoveryStore.preferences) {
                preference.value.sort =
                    discoveryStore.preferences.sort || preference.value.sort
                preference.value.display =
                    discoveryStore.preferences.display ||
                    preference.value.display
            }

            const {
                list,
                isLoading,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                assetTypeAggregationList,
                error,
                isValidating,
                updateList,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                suppressLogs: true,
            })

            const updateCurrentList = (asset: any) => {
                updateList(asset)
            }

            const handleAssetTypeChange = (tabName) => {
                offset.value = 0
                quickChange()
            }

            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            const handleChangeSort = () => {
                quickChange()
            }

            const handleChangePreference = () => {
                quickChange()
            }

            const handleDisplayChange = () => {
                discoveryStore.setPreferences(preference.value)
            }
            const reset = () => {
                list.value = []
                visible.value = false
                queryText.value = ''
                offset.value = 0
            }
            const handleItemClick = (item, index: Number) => {
                currentIndex.value = index
                selectedAssetDrawerGuid.value = item?.guid
                showAssetSidebarDrawer.value = true
            }

            const handleNavigation = (direction: 'up' | 'down') => {
                if (direction === 'up') {
                    currentIndex.value -= currentIndex.value
                } else {
                    currentIndex.value = currentIndex.value + 1
                }
                if (assetItemRef.value?.handleUpdateDrawer) {
                    selectedAssetDrawerGuid.value =
                        list.value[currentIndex.value]?.guid
                }
            }

            onMounted(() => updateFacet())

            const updateDrawerList = (asset: assetInterface) => {
                console.log(asset)
                emit('update', asset)
            }

            const handleCloseDrawer = () => {
                selectedAssetDrawerGuid.value = ''
                showAssetSidebarDrawer.value = false
            }

            provide('updateDrawerList', updateDrawerList)
            provide('showDrawerNavigator', true)
            provide('currentIndex', currentIndex)
            provide('totalCount', totalCount)
            provide('handleNavigation', handleNavigation)

            // watches any change in guids and updates list and drawer accordingly
            watch(groupedProcessIds, () => {
                if (groupedProcessIds.value?.length) {
                    visible.value = true
                    dependentKey.value = `RELATED_ASSET_LIST_PROCESS_NODES`
                    updateFacet()
                    fetch()
                } else {
                    reset()
                }
            })

            // TODO : remove after testing
            watch(list, () => {
                console.log(list)
            })
            return {
                visible,
                queryText,
                handleSearchChange,
                totalCount,
                handleDisplayChange,
                preference,
                isLoading,
                list,
                isValidating,
                isLoadMore,
                handleLoadMore,
                updateCurrentList,
                assetItemRef,
                currentIndex,
                handleItemClick,
                selectedAssetDrawerGuid,
                showAssetSidebarDrawer,
                handleCloseDrawer,
            }
        },
    })
</script>

<style lang="less" module>
    .drawerStyles {
        :global(.ant-drawer-body) {
            @apply h-full !important;
            width: 420px;
        }
        :global(.ant-drawer-content-wrapper) {
            width: 420px;
        }
    }
</style>
