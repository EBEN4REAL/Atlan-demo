<template>
    <div class="flex flex-col flex-1 h-full bg-primary-menu">
        <div class="flex flex-col px-6 py-3">
            <span class="text-xl font-semibold text-gray-700">
                Metadata Marketplace</span
            >
            <span class="text-sm text-gray-500">
                Home for all your meta needs</span
            >
        </div>

        <div class="flex items-center justify-between w-full px-6 pb-3">
            <AggregationTabs
                :list="getAggregationByType"
                v-model="postFacets.typeName"
                @change="handlePackageTypeChange"
            ></AggregationTabs>
            <div class="w-1/3">
                <a-input
                    v-model:value="queryText"
                    placeholder="Search Packages"
                    @change="handleSearchChange"
                ></a-input>
            </div>
        </div>

        <div class="flex flex-1 w-full h-full mb-3 overflow-y-auto">
            <div
                class="flex items-center justify-center w-full"
                v-if="isLoading"
            >
                <a-spin></a-spin>
            </div>
            <div
                class="flex items-center justify-center w-full"
                v-else-if="error && !isLoading"
            >
                <ErrorView></ErrorView>
            </div>
            <div
                class="flex items-center justify-center w-full"
                v-else-if="!error && !isLoading && list.length === 0"
            >
                <EmptyView
                    desc="No packages found"
                    empty-screen="WFEmptyTab"
                ></EmptyView>
            </div>

            <!-- <div class="flex ml-6 filters">
                        <PackageFilters
                            :filter-list="packageFilters"
                            v-model="facets"
                            v-model:activeKey="activeKey"
                            @change="handleFilterChange"
                            @reset="handleResetEvent"
                        ></PackageFilters>
                    </div> -->

            <PackageList
                v-else
                :list="list"
                class="px-6"
                @select="handleSelect"
                @dblClick="handleDoubleClick"
            ></PackageList>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'
    import EmptyView from '@/common/empty/index.vue'
    import ErrorView from '@/common/error/discover.vue'
    import PackageList from '~/workflows/components/packages/list/index.vue'
    import PackageFilters from '~/workflows/components/packages/filters/index.vue'
    import { packageFilters } from '~/workflows/constants/packageFilters'
    import { usePackageDiscoverList } from '~/workflows/composables/package/usePackageDiscoverList'

    export default defineComponent({
        name: 'PackageDiscovery',
        components: {
            PackageFilters,
            PackageList,
            ErrorView,
            EmptyView,
            AggregationTabs,
        },
        props: {
            initialFilters: {
                type: Object,
                required: false,
            },
            showAggrs: {
                type: Boolean,
                required: false,
                default: true,
            },
            staticUse: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['setup', 'sandbox', 'select'],
        setup(props, { emit }) {
            const limit = ref(20)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({
                verified: true,
            })

            const postFacets = ref({
                typeName: 'connector',
            })

            const activeKey = ref(['sourceCategory_0'])

            const dependentKey = ref('DEFAULT_PACKAGES')

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            const handleSetup = (item) => {
                emit('setup', selectedPackage.value)
            }
            const handleSetupSandbox = (item) => {
                emit('sandbox', selectedPackage.value)
            }

            // const { refresh, isLoading, list, error } = usePackageList({
            //     isCache: true,
            //     dependentKey,
            //     queryText,
            //     filters,
            //     limit,
            //     offset,
            // })
            const aggregationPackage = ref(['by_type'])
            const {
                isLoading,
                list,
                error,
                quickChange,
                getAggregationByType,
            } = usePackageDiscoverList({
                isCache: true,
                dependentKey,
                facets,
                postFacets,
                limit,
                offset,
                queryText,
                source: ref({
                    excludes: ['spec'],
                }),
                aggregations: aggregationPackage,
            })

            const handleFilterChange = () => {
                console.log('change facets', facets)
                offset.value = 0
                quickChange()
            }

            const placeholder = computed(() => 'Search all packages')

            const selectedPackage = ref<any>(null)

            const handleSelect = (item) => {
                selectedPackage.value = item
                emit('select', item)
            }

            const handleDoubleClick = (item) => {
                handleSelect(item)
                handleSetup(item)
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

            const handlePackageTypeChange = () => {
                offset.value = 0
                handleSearchChange()
            }

            const handleResetEvent = () => {
                facets.value = {
                    verified: true,
                }
                queryText.value = ''
                handleFilterChange()
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                searchDirtyTimestamp.value = `dirty_${Date.now().toString()}`
            }

            return {
                placeholder,
                dirtyTimestamp,
                searchDirtyTimestamp,
                isLoading,
                list,
                handleSelect,
                selectedPackage,
                queryText,
                error,
                packageFilters,
                facets,
                handleSetupSandbox,
                handleSetup,
                handleFilterChange,
                handleSearchChange,
                activeKey,
                handleResetEvent,
                handleDoubleClick,
                postFacets,
                aggregationPackage,
                getAggregationByType,
                handlePackageTypeChange,
            }
        },
    })
</script>

<style lang="less">
    .filters {
        width: 25%;
    }

    .metadata-header {
        background: url('~/assets/images/workflows/header.svg');
        background-color: #fff;

        /* Add the blur effect */
        filter: blur(2px);
        -webkit-filter: blur(2px);

        /* Full height */
        height: 100%;
        width: 100%;

        /* Center and scale the image nicely */
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
    }
</style>
