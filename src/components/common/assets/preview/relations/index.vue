<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <div class="flex items-center justify-between px-5 py-4">
            <div class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    class="mb-0.5"
                    height="h-4"
                    :display-mode="true"
                />
                <div class="ml-1 font-semibold text-gray-500">
                    Related Assets
                </div>
            </div>
        </div>

        <div class="px-5 pb-0">
            <SearchAdvanced
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${totalCount} related assets`"
                class=""
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

        <AggregationTabs
            v-model="selectedType"
            class="px-5 mt-2 mb-1"
            :list="assetTypeAggregationList"
            @change="handleAssetTypeChange"
        ></AggregationTabs>

        <div
            v-if="isLoading || isFetchingGuids"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanLoader class="h-10" />
        </div>
        <div
            v-if="!isLoading && !isFetchingGuids && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>
        <div
            v-else-if="
                (list.length === 0 || guidList.length === 0) &&
                !isLoading &&
                !isFetchingGuids
            "
            class="flex-grow"
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
                    :item="item"
                    :item-index="itemIndex"
                    :preference="preference"
                    :enable-sidebar-drawer="true"
                    :asset-name-truncate-percentage="'91%'"
                    class="px-2 hover:bg-primary-menu"
                    @updateDrawer="updateCurrentList"
                    isCompact
                ></AssetItem>
            </template>
        </AssetList>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        toRefs,
        watch,
        PropType,
        inject,
    } from 'vue'
    import { debouncedWatch, useDebounceFn } from '@vueuse/core'

    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    import {
        DefaultRelationAttributes,
        MinimalAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useRelations } from '~/composables/discovery/useRelations'
    import { whenever } from '@vueuse/core'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        name: 'RelationshipsTab',
        components: {
            SearchAdvanced,
            AggregationTabs,
            AssetList,
            AssetItem,
            PreferenceSelector,
            EmptyView,
            ErrorView,
            PreviewTabsIcon,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            tab: {
                type: Object,
                required: false,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const selectedType = inject('selectedTypeInRelation', ref('__all'))

            const {
                guidList,
                isLoading: isFetchingGuids,
                isReady: isGuidArrayReady,
            } = useRelations(selectedAsset)

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})

            const aggregations = ref(['typeName'])

            const postFacets = computed(() => ({
                typeName: selectedType.value,
            }))

            const dependentKey = ref(null)

            const defaultAttributes = ref([...MinimalAttributes])
            const preference = ref({ sort: 'default', display: [] })
            const relationAttributes = ref([...DefaultRelationAttributes])

            const updateFacet = () => {
                facets.value = {}
                facets.value.guidList = guidList.value
            }
            updateFacet()

            const discoveryStore = useAssetStore()

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

            debouncedWatch(
                () => props.selectedAsset.attributes.qualifiedName,
                (prev) => {
                    if (prev) {
                        updateFacet()
                        quickChange()
                    }
                },
                { debounce: 100 }
            )

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

            whenever(isGuidArrayReady, () => {
                dependentKey.value = `RELATED_ASSET_LIST_${selectedAsset.value?.typeName}`

                updateFacet()

                fetch()
            })

            return {
                isLoading,
                isFetchingGuids,
                queryText,
                list,
                facets,
                isLoadMore,
                postFacets,
                assetTypeAggregationList,
                fetch,
                quickChange,
                totalCount,
                updateFacet,
                handleAssetTypeChange,
                handleDisplayChange,
                handleSearchChange,
                preference,
                handleChangeSort,
                handleLoadMore,
                handleChangePreference,
                error,
                isValidating,
                updateCurrentList,
                guidList,
                selectedType,
            }
        },
    })
</script>
