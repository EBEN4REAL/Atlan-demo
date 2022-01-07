<template>
    <div class="flex w-full h-full">
        <!-- <div><AssetFilters /></div> -->
        <div class="flex flex-col w-full h-full">
            <div class="w-full">
                <SearchAdvanced
                    v-model="queryText"
                    :autofocus="true"
                    :allow-clear="true"
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
            <div>
                <AggregationTabs
                    v-model="postFacets.typeName"
                    :list="assetTypeAggregationList"
                    @change="handleAssetTypeChange"
                />
            </div>
            <div>
                <AssetList
                    :list="list"
                    :is-load-more="isLoadMore"
                    :is-loading="isValidating"
                    @loadMore="handleLoadMore"
                >
                    <template #default="{ item }">
                        <AssetItem
                            :preference="preference"
                            :item="item"
                        ></AssetItem>
                    </template>
                </AssetList>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import PreferenceSelector from '@/assets/preference/index.vue'
    import AssetList from '@/common/assets/list/index.vue'
    import AssetItem from '@/common/assets/list/assetItem.vue'
    import useFetchAssetList from '~/composables/discovery/useFetchAssetList'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import {
        AssetAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        name: 'AssetsV2',
        components: {
            AssetFilters,
            SearchAdvanced,
            AggregationTabs,
            PreferenceSelector,
            AssetList,
            AssetItem,
        },
        props: {
            ownerUsers: {
                type: Array as PropType<string[]>,
                default: () => [],
            },
            ownerGroups: {
                type: Array as PropType<string[]>,
                default: () => [],
            },
        },
        setup(props) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
        const facets = ref({})
            const isCache = ref(true) // use SWRV or not
            const dependentKey = ref('DEFAULT_ASSET_LIST') // CacheKey for swrv, when changed causes asset list to get refetched
            facets.value = {
                owners: {
                    ownerUsers: props.ownerUsers,
                    ownerGroups: props.ownerGroups,
                },
            }
            const preference = ref({
                sort: 'default',
                display: [],
            })
            // set all the attributes that would be fetched
            const { customMetadataProjections } = useTypedefData()
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
                ...customMetadataProjections,
            ])
            const postFacets = ref({
                typeName: '__all',
            })
            const aggregations = ref(['typeName'])
            const {
                list,
                isLoadMore,
                quickChange,
                isValidating,
                assetTypeAggregationList,
            } = useFetchAssetList({
                queryText,
                offset,
                limit,
                facets,
                postFacets,
                aggregations,
                preference,
                isCache,
                dependentKey,
                attributes: defaultAttributes,
            })

            // LOAD MORE
            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            // SEARCH
            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 100)

            // TYPE FILTER (AGG TABS)
            const handleAssetTypeChange = () => {
                offset.value = 0
                quickChange()
            }

            // PREFERENCE : SORT
            const handleChangePreference = () => {
                quickChange()
            }
            return {
                limit,
                offset,
                queryText,
                facets,
                postFacets,
                list,
                isLoadMore,
                isValidating,
                assetTypeAggregationList,
                preference,
                handleLoadMore,
                handleSearchChange,
                handleAssetTypeChange,
                handleChangePreference,
            }
        },
    })
</script>

<style></style>
