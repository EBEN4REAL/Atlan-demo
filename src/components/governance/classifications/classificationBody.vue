<template>
    <MinimalTab v-model:active="activeTabKey" :data="tabConfig" />
    <KeepAlive>
        <div class="overflow-y-scroll">
            <ClassificationOverview v-if="activeTabKey === '1'" :classification="selectedClassification" @openAssetsTab="activeTabKey = '2'"/>
            <AssetsWrapper 
                v-if="activeTabKey === '2'" 
                :initialFilters="filterConfig" 
                :showFilters="false"  
            />
        </div>
    </KeepAlive>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
    import AssetsWrapper from '@/assets/index.vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import ClassificationOverview from '@/governance/classifications/overview.vue'

    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    import {
        AssetAttributes,
        AssetRelationAttributes,
        InternalAttributes,
        SQLAttributes,
    } from '~/constant/projection'

    export default defineComponent({
        name: 'ClassificationBody',
        components: {
            AssetsWrapper,
            MinimalTab,
            ClassificationOverview,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const { classification: selectedClassification } = toRefs(props)

            const activeTabKey = ref('1')
            const tabConfig = [
                { key: '1', label: 'Overview' },
                { key: '2', label: 'Assets' },
            ]

            const filterConfig = computed(() => ({
                __traitNames: {
                    classifications: [selectedClassification.value.name]
                },
            }))



            const limit = ref(20)
            const offset = ref(0)
            const dependentKey = ref('DEFAULT_ASSET_LIST')
            const queryText = ref('')
            const facets = ref({
                __traitNames: {
                    classifications: [selectedClassification.value.name]
                },
            })
            const preference = ref({
                sort: 'default',
                display: [],
            })
            const aggregations = ref(['typeName'])
            const postFacets = ref({
                typeName: '__all',
            })
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
                isValidating,
                fetch,

                error,
                selectedAsset,
                quickChange,
                handleSelectedAsset,
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


            return {
                selectedClassification,
                filterConfig,
                activeTabKey,
                tabConfig,
                assetTypeAggregationList
            }
        },
    })
</script>

<style lang="less">
    .typeTabs {
        .ant-tabs-tab {
            padding-left: 2px !important;
            padding-right: 2px !important;
            padding-top: 8px !important;
            padding-bottom: 16px !important;
            @apply mr-4 !important;
            @apply text-gray-500;
            @apply text-sm !important;
            @apply tracking-wide;
        }
        .ant-tabs-tab:first-child {
            margin-left: 18px !important;
        }
        .ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child {
            @apply ml-0;
        }
        .ant-tabs-tab-active {
            @apply text-gray !important;
            @apply font-bold !important;
            @apply tracking-normal;
        }
        .ant-tabs-bar {
            margin-bottom: 0px;
            @apply border-gray-300 !important;
        }
        .ant-tabs-content {
            padding-right: 0px;
        }
        .ant-tabs-ink-bar {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
    }
</style>
