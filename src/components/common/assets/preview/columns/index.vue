<template>
    <div class="flex flex-col h-full" style="height: calc(100% - 84px)">
        <div class="px-4 pt-3 pb-0">
            <SearchAdvanced
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${totalCount} columns`"
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

        <AggregationTabs
            class="px-3 mb-1"
            v-model="postFacets.dataType"
            :list="columnDataTypeAggregationList"
            @change="handleDataTypeChange"
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
                desc="No assets found"
            ></EmptyView>
        </div>
        <!-- {{ list }} -->
        <AssetList
            v-else
            ref="assetlistRef"
            :list="list"
            :isLoadMore="isLoadMore"
            :isLoading="isValidating"
            @loadMore="handleLoadMore"
        >
            <template v-slot:default="{ item }">
                <ColumnItem :item="item" class="m-1" />
            </template>
        </AssetList>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import { debouncedWatch, useDebounceFn } from '@vueuse/core'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Preferences from '@/assets/preference/index.vue'

    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'

    import AssetList from '@/common/assets/list/index.vue'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import ColumnItem from './assetItem.vue'

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
            ColumnItem,
            EmptyView,
            ErrorView,
        },
        props: {
            selectedAsset: {
                type: Object,
                required: true,
            },
            page: {
                type: String,
                required: true,
            },
            showCrossIcon: {
                type: Boolean,
                required: false,
            },
            mutateTooltip: {
                type: Boolean,
                default: false,
                required: false,
            },
        },
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)

            const aggregationAttributeName = 'dataType'
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                typeName: 'Column',
            })
            const aggregations = ref([aggregationAttributeName])
            const postFacets = ref({})
            const dependentKey = ref('DEFAULT_COLUMNS')
            const defaultAttributes = ref([
                ...InternalAttributes,
                ...AssetAttributes,
                ...SQLAttributes,
            ])
            const preference = ref({
                sort: 'order-asc',
            })
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

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                getAggregationList,
                error,
                isValidating,
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
                () => props.selectedAsset.attributes.qualifiedName,
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
                handleLoadMore,
                error,
                isValidating,
            }
        },
    })
</script>
