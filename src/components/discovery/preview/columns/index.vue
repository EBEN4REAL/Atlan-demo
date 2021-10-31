<template>
    <div class="flex flex-col h-full">
        <div class="px-2 py-1 border-b border-gray-200">
            <SearchAdvanced
                v-model:value="queryText"
                :autofocus="true"
                :placeholder="`Search ${totalCount} columns`"
                class=""
            >
                <template #postFilter>
                    <Preferences />
                </template>
            </SearchAdvanced>
        </div>

        <!-- {{ list }} -->

        <AggregationTabs
            class="mt-2"
            v-model="postFacets.dataType"
            :list="columnDataTypeAggregationList"
        ></AggregationTabs>

        <AssetList
            ref="assetlistRef"
            :list="list"
            :isLoadMore="isLoadMore"
            :isLoading="isLoading"
        />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import SearchAdvanced from '@/common/input/searchAdvanced.vue'
    import Preferences from '@/discovery/preference.vue'
    import { useColumnListing } from '~/composables/discovery/useColumnListing'
    import AssetList from '@/discovery/preview/columns/assetList.vue'
    import AssetFilters from '@/discovery/filters/index.vue'

    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import { debouncedWatch } from '@vueuse/core'

    export default defineComponent({
        components: {
            SearchAdvanced,
            Preferences,
            AggregationTabs,
            AssetList,
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

            const aggregationAttributeName = ''
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
            const relationAttributes = ref([...AssetRelationAttributes])

            const {
                list,
                isLoading,
                assetTypeAggregationList,
                isLoadMore,
                fetch,
                quickChange,
                totalCount,
                getAggregationList,
            } = useDiscoverList(
                true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                aggregations,
                limit,
                offset,
                defaultAttributes,
                relationAttributes
            )

            const columnDataTypeAggregationList = computed(() =>
                getAggregationList(
                    `group_by_${aggregationAttributeName}`,
                    [],
                    true
                )
            )

            // watch(
            //     () => props.selectedAsset,
            //     (first, second) => {
            //         console.log(
            //             'Watch props.selected function called with args:',
            //             first,
            //             second
            //         )
            //     }
            // )
            debouncedWatch(
                () => props.selectedAsset.attributes.qualifiedName,
                (prev, current) => {
                    if (prev) {
                        if (
                            selectedAsset?.value.typeName?.toLowerCase() ===
                            'table'
                        ) {
                            facets.value.tableQualifiedName =
                                selectedAsset?.value.attributes.qualifiedName
                        }
                        if (
                            selectedAsset?.value.typeName?.toLowerCase() ===
                            'view'
                        ) {
                            facets.value.viewQualifiedName =
                                selectedAsset?.value.attributes.qualifiedName
                        }
                        quickChange()
                    }
                },
                { debounce: 100 }
            )

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
            }
        },
    })
</script>

<style lang="less" module></style>
