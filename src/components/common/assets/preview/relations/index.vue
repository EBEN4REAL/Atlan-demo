<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <div class="px-4 pt-3 pb-0">
            <SearchAdvanced
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${totalCount} relations`"
                class=""
                @change="handleSearchChange"
            >
                <template #postFilter>
                    <div style="max-width: 330px">
                        <PreferenceSelector
                            v-model="preference"
                            @change="handleChangePreference"
                        />
                    </div>
                </template>
            </SearchAdvanced>
        </div>

        <AggregationTabs
            v-model="postFacets.typeName"
            class="px-3 mb-1"
            :list="assetTypeAggregationList"
            @change="handleAssetTypeChange"
        ></AggregationTabs>

        <div
            v-if="isLoading"
            class="flex items-center justify-center flex-grow"
        >
            <AtlanIcon
                icon="Loader"
                class="w-auto h-10 animate-spin"
            ></AtlanIcon>
        </div>
        <div
            v-if="!isLoading && error"
            class="flex items-center justify-center flex-grow"
        >
            <ErrorView></ErrorView>
        </div>
        <div v-else-if="list.length === 0 && !isLoading" class="flex-grow">
            <EmptyView
                empty-screen="EmptyDiscover"
                desc="No relations found"
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
                    class="mx-3"
                    @updateDrawer="updateCurrentList"
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
    } from 'vue'
    import { debouncedWatch, useDebounceFn } from '@vueuse/core'

    import ErrorView from '@common/error/discover.vue'
    import EmptyView from '@common/empty/index.vue'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import { useRelations } from '~/composables/discovery/useRelations'

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
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})

            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: '__all',
            })
            const dependentKey = ref('RELATED_ASSET_LIST')
            const { customMetadataProjections } = useTypedefData()

            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
            ])
            const preference = ref({})
            const relationAttributes = ref([...AssetRelationAttributes])

            const updateFacet = () => {
                facets.value = {}
                if (selectedAsset?.value.typeName?.toLowerCase() === 'table') {
                    facets.value.tableQualifiedName =
                        selectedAsset?.value.attributes.qualifiedName
                }
                if (selectedAsset?.value.typeName?.toLowerCase() === 'view') {
                    facets.value.viewQualifiedName =
                        selectedAsset?.value.attributes.qualifiedName
                }
            }

            updateFacet()

            const { asset } = useRelations(selectedAsset)

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

            return {
                isLoading,
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
                handleSearchChange,
                preference,
                handleChangeSort,
                handleLoadMore,
                handleChangePreference,
                error,
                isValidating,
                updateCurrentList,
            }
        },
    })
</script>
