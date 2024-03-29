<template>
    <a-drawer
        v-model:visible="visible"
        placement="right"
        :class="$style.drawerStyles"
        :closable="false"
        :mask-closable="false"
        :width="420"
        :mask="false"
    >
        <div
            v-if="visible"
            class="collapse-btn"
            @click="() => $emit('closeDrawer')"
        >
            <AtlanIcon icon="CaretRight" class="w-auto h-4" />
        </div>

        <transition name="fade">
            <div class="w-full h-full">
                <div
                    v-if="!isLoading && error"
                    class="flex items-center justify-center flex-grow"
                >
                    <ErrorView></ErrorView>
                </div>
                <div v-if="!error">
                    <div class="flex items-center px-5 py-2 pt-4 border-b">
                        <div
                            class="flex items-center justify-center p-2 border rounded"
                        >
                            <atlan-icon icon="Code" class="h-4" />
                        </div>
                        <div class="flex flex-col ml-2">
                            <span class="text-base font-bold text-gray-700"
                                >All Process</span
                            >
                            <span class="text-gray-500"
                                >{{ totalCount }} processes
                            </span>
                        </div>
                    </div>

                    <div class="pb-0 mx-5 mt-2 border-b">
                        <SearchAdvanced
                            v-model:value="queryText"
                            :autofocus="true"
                            :allow-clear="true"
                            :placeholder="`Search process`"
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
                        v-if="isLoading || isValidating"
                        class="flex items-center justify-center w-full h-full"
                    >
                        <AtlanLoader class="h-6 mx-auto mt-5" />
                    </div>
                    <AssetList
                        v-else
                        :list="list"
                        :is-load-more="isLoadMore"
                        :is-loading="isValidating"
                        @load-more="handleLoadMore"
                    >
                        <template #default="{ item, itemIndex }">
                            <AssetItem
                                ref="assetItemRef"
                                :item="item"
                                :item-index="itemIndex"
                                :preference="preference"
                                :enable-sidebar-drawer="false"
                                :asset-name-truncate-percentage="'80%'"
                                class="px-2 cursor-pointer hover:bg-primary-menu text-primary"
                                is-compact
                                @click="handleItemClick(item, itemIndex)"
                            ></AssetItem>
                        </template>
                    </AssetList>
                </div>
                <div
                    v-if="!isLoading && !isValidating && list?.length === 0"
                    class="flex items-center justify-center flex-grow mt-24"
                >
                    <EmptyView
                        empty-screen="NoAssetsFound"
                        image-class="h-44"
                        desc="We didn't find anything that matches your search criteria"
                    ></EmptyView>
                </div>
            </div>
        </transition>
    </a-drawer>

    <AssetDrawer
        :guid="selectedAssetDrawerGuid"
        :watch-guid="true"
        :show-mask="false"
        :show-collapse-button="true"
        :show-drawer="showAssetSidebarDrawer"
        class="z-99"
        @close-drawer="handleCloseDrawer"
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
    import { useDebounceFn } from '@vueuse/core'

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
        emits: ['closeDrawer'],
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
            const dependentKey = ref<String | null>(null)
            const defaultAttributes = ref<String[]>([...MinimalAttributes])
            const preference = ref({ sort: 'default', display: [] })
            const relationAttributes = ref<String[]>([
                ...DefaultRelationAttributes,
            ])
            const postFacets = computed(() => ({
                typeName: selectedType.value,
            }))

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

            const handleDisplayChange = () => {
                discoveryStore.setPreferences(preference.value)
            }
            const reset = () => {
                list.value = []
                visible.value = false
                queryText.value = ''
                offset.value = 0
                showAssetSidebarDrawer.value = false
            }
            const handleItemClick = (item, index: Number) => {
                currentIndex.value = index
                selectedAssetDrawerGuid.value = item?.guid
                showAssetSidebarDrawer.value = true
            }

            const handleNavigation = (direction: 'up' | 'down') => {
                if (direction === 'up') currentIndex.value -= 1
                else currentIndex.value += 1

                if (assetItemRef.value?.handleUpdateDrawer) {
                    selectedAssetDrawerGuid.value =
                        list.value[currentIndex.value]?.guid
                }
            }

            const updateDrawerList = (asset: assetInterface) => {
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

            watch(groupedProcessIds, () => {
                if (groupedProcessIds.value?.length) {
                    if (showAssetSidebarDrawer.value) handleCloseDrawer()
                    // if (visible.value) return
                    visible.value = true
                    dependentKey.value = `RELATED_ASSET_LIST_PROCESS_NODES`
                    updateFacet()
                    fetch()
                } else reset()
            })

            onMounted(() => updateFacet())

            return {
                visible,
                queryText,
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
                handleSearchChange,
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

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.1s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0.2;
    }

    .collapse-btn {
        @apply p-1 border-t border-b border-l fixed cursor-pointer bg-white rounded-l-md border-gray-300 shadow-sm;
        right: 420px;
        top: 90px;
    }
</style>
