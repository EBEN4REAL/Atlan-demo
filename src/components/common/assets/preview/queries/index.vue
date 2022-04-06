<template>
    <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-5 py-4">
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500">Queries</span>
            </span>
        </div>
        <div
            v-if="isLoading"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanLoader class="h-10" />
        </div>
        <div
            v-else-if="!isLoading && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>

        <div
            v-else-if="list.length === 0 && !isLoading && queryText === ''"
            class="flex-grow"
        >
            <EmptyView
                empty-screen="EmptyQueriesTab"
                desc="This asset doesn't have any saved queries"
                button-text="Create a new query"
                button-color="secondary"
                button-class="mt-4"
                @event="handleCreateQuery"
            ></EmptyView>
        </div>

        <div v-else class="flex flex-col flex-grow overflow-y-auto">
            <div class="px-5 pt-3 pb-0">
                <SearchAdvanced
                    v-model:value="queryText"
                    :autofocus="true"
                    :placeholder="`Search ${totalCount} queries`"
                    class=""
                    @change="handleSearchChange"
                />
            </div>

            <div
                v-if="list.length === 0 && !isLoading && queryText !== ''"
                class="flex items-center justify-center flex-grow"
            >
                <EmptyView
                    empty-screen="NoAssetsFound"
                    image-class="h-44"
                    desc="No queries found"
                ></EmptyView>
            </div>

            <!-- {{ list }} -->
            <AssetList
                v-else
                ref="assetlistRef"
                :list="list"
                :is-load-more="isLoadMore"
                :is-loading="isValidating || isQueriesRelationsLoading"
                @loadMore="handleLoadMore"
                class="mt-2"
            >
                <template #default="{ item, itemIndex }">
                    <Popover
                        :item="item"
                        @previewAsset="handleOpenDrawer(item.guid)"
                    >
                        <AssetItem
                            :item="item"
                            :item-index="itemIndex"
                            :asset-name-truncate-percentage="'93%'"
                            class="px-2 hover:bg-primary-menu"
                            is-compact
                            @preview="handleOpenDrawer(item.guid)"
                            @updateDrawer="handleListUpdate"
                        />
                    </Popover>
                </template>
            </AssetList>
        </div>
        <AssetDrawer
            :guid="guidToFetch"
            :show-drawer="drawerVisible"
            @closeDrawer="handleCloseDrawer"
            @update="handleListUpdate"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType, watch } from 'vue'
    import { debouncedWatch, useDebounceFn } from '@vueuse/core'

    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'

    import AssetItem from '@common/assets/list/assetItem.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'

    import AssetList from '@/common/assets/list/index.vue'

    import {
        DefaultRelationAttributes,
        MinimalAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Popover from '@/common/popover/assets/index.vue'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    import { whenever } from '@vueuse/core'

    export default defineComponent({
        name: 'ColumnWidget',
        components: {
            SearchAdvanced,
            PreviewTabsIcon,
            AssetList,
            AssetItem,
            EmptyView,
            ErrorView,
            Popover,
            AssetDrawer,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const { queries, getAssetQueryPath } = useAssetInfo()

            const guid = ref()
            const queriesAttribute = ref(['queries'])

            const {
                asset,
                mutate: mutateQueries,
                isReady: isQueriesGuidReady,
                isLoading: isQueriesRelationsLoading,
            } = useAssetAttributes({
                id: guid,
                attributes: queriesAttribute,
            })

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')

            const facets = ref({})
            const postFacets = ref({ typeName: 'Query' })

            const dependentKey = ref()
            const defaultAttributes = ref([
                ...MinimalAttributes,
                'ownerUsers',
                'ownerGroups',
            ])
            const preference = ref({})
            const guidToFetch = ref('')
            const drawerVisible = ref(false)
            const relationAttributes = ref([...DefaultRelationAttributes])

            const updateFacet = () => {
                facets.value = {}

                if (
                    selectedAsset?.value.typeName?.toLowerCase() ===
                    'collection'
                ) {
                    facets.value.collectionQualifiedName =
                        selectedAsset.value?.attributes?.qualifiedName
                } else {
                    facets.value.guidList = queries(asset.value)?.map(
                        (query) => query.guid
                    )
                }
            }

            const {
                list,
                isLoading,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                error,
                isValidating,
                updateList,
            } = useDiscoverList({
                isCache: false,
                dependentKey,
                queryText,
                facets,
                postFacets,
                preference,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                suppressLogs: true,
            })

            const handleListUpdate = (asset: any) => {
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

            const handleCreateQuery = () => {
                window.open(getAssetQueryPath(selectedAsset.value))
            }

            const handleOpenDrawer = (guid) => {
                drawerVisible.value = true
                guidToFetch.value = guid
            }

            const handleCloseDrawer = () => {
                drawerVisible.value = false
                guidToFetch.value = ''
            }
            watch(
                () => selectedAsset.value.guid,
                () => {
                    guid.value = selectedAsset.value?.guid
                    mutateQueries()
                },
                {
                    immediate: true,
                }
            )

            whenever(isQueriesGuidReady, () => {
                dependentKey.value = 'DEFAULT_QUERIES'
                updateFacet()
                quickChange()
            })

            return {
                isLoading,
                queryText,
                list,
                facets,
                isLoadMore,
                postFacets,
                fetch,
                quickChange,
                totalCount,
                updateFacet,
                handleSearchChange,
                handleLoadMore,
                error,
                isValidating,
                isQueriesRelationsLoading,
                handleListUpdate,
                handleCreateQuery,
                handleOpenDrawer,
                handleCloseDrawer,
                drawerVisible,
                guidToFetch,
            }
        },
    })
</script>
