<template>
    <div class="px-5 pt-3 pb-0">
        <SearchAdvanced
            v-model:value="queryText"
            :autofocus="true"
            :placeholder="`Search ${totalCount} assets`"
            class=""
            @change="handleSearchChange"
        >
            <template #postFilter>
                <Preferences
                    assetType="Column"
                    v-model="preference"
                    @change="handleChangePreference"
                />
            </template>
        </SearchAdvanced>
    </div>

    <!-- {{ list }} -->

    <AggregationTabs
        class="px-4 mb-1"
        v-model="postFacets.typeName"
        :list="assetTypeAggregationList"
        @change="handleDataTypeChange"
    ></AggregationTabs>

    <AssetList
        ref="assetlistRef"
        class="overflow-y-auto"
        :list="list"
        :isLoadMore="isLoadMore"
        :isLoading="isLoading"
    >
        <template v-slot:default="{ item }">
            <AssetItem
                :item="item"
                :preference="preference"
                class="mx-4"
            ></AssetItem>
        </template>
    </AssetList>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { debouncedWatch, useDebounceFn } from '@vueuse/core'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Preferences from '@/assets/preference/index.vue'

    import AssetList from './assetList.vue'
    import AssetItem from './assetItem.vue'

    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    export default defineComponent({
        name: 'ColumnWidget',
        components: {
            SearchAdvanced,
            Preferences,
            AggregationTabs,
            AssetList,
            AssetItem,
        },
        props: {
            selectedGuid: {
                type: String,
                required: false,
            },
            showCrossIcon: {
                type: Boolean,
                required: false,
            },
            direction: {
                type: String,
                required: false,
            },
            mutateTooltip: {
                type: Boolean,
                default: false,
                required: false,
            },
        },

        setup(props, { emit }) {
            const { selectedGuids } = toRefs(props)

            const aggregationAttributeName = 'typeName'
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})
            const aggregations = ref([aggregationAttributeName])
            const postFacets = ref({})
            const dependentKey = ref('default_lineage')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const preference = ref({
                display: [],
            })
            const relationAttributes = ref([...AssetRelationAttributes])

            const updateFacet = () => {
                facets.value = {
                    ...facets.value,
                    guidList: selectedGuids.value,
                }
                // facets.value = {}
                // if (selectedAsset?.value.typeName?.toLowerCase() === 'table') {
                //     facets.value.tableQualifiedName =
                //         selectedAsset?.value.attributes.qualifiedName
                // }
                // if (selectedAsset?.value.typeName?.toLowerCase() === 'view') {
                //     facets.value.viewQualifiedName =
                //         selectedAsset?.value.attributes.qualifiedName
                // }
            }

            updateFacet()

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                getAggregationList,
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

            const columnDataTypeAggregationList = computed(() =>
                getAggregationList(
                    `group_by_${aggregationAttributeName}`,
                    [],
                    true
                )
            )

            debouncedWatch(
                () => props.selectedGuids,
                (prev, current) => {
                    if (prev) {
                        updateFacet()
                        quickChange()
                    }
                },
                { debounce: 100 }
            )

            const handleDataTypeChange = () => {
                offset.value = 0
                quickChange()
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
                // tracking.send(events.EVENT_ASSET_SEARCH, {
                //     trigger: 'discover',
                // })
            }, 150)

            const handleChangePreference = () => {
                quickChange()
            }

            return {
                isLoading,
                queryText,
                assetTypeAggregationList,
                list,
                facets,
                isLoadMore,
                postFacets,
                columnDataTypeAggregationList,
                fetch,
                quickChange,
                totalCount,
                updateFacet,
                handleDataTypeChange,
                handleSearchChange,
                preference,
                handleChangePreference,
                selectedGuids,
            }
        },
    })
</script>

<style lang="less" module></style>
