<template>
    <div class="flex flex-1 metadata-header">
        <div class="flex flex-col w-full h-full overflow-hidden">
            <div class="flex items-center px-6 py-3 text-lg font-semibold">
                <a-tooltip title="Back to Workflow Center">
                    <a-button class="px-1 mr-2" @click="handleBack">
                        <atlan-icon
                            icon="ArrowRight"
                            class="w-auto h-4 text-gray-500 transform rotate-180"
                        />
                    </a-button>
                </a-tooltip>
                Metadata Marketplace
            </div>

            <div class="flex flex-1 w-full h-full">
                <div
                    class="flex items-center justify-center w-full"
                    v-if="isLoading"
                >
                    <a-spin></a-spin>
                </div>
                <div
                    class="flex items-center justify-center w-full"
                    v-if="error && !isLoading"
                >
                    <ErrorView></ErrorView>
                </div>
                <div
                    class="flex items-center justify-center w-full"
                    v-if="!error && !isLoading && list.length === 0"
                >
                    <EmptyView
                        desc="No packages found"
                        empty-screen="WFEmptyTab"
                    ></EmptyView>
                </div>
                <div v-else class="flex h-full">
                    <div class="flex ml-6 filters">
                        <PackageFilters
                            :filter-list="packageFilters"
                            v-model="facets"
                            v-model:activeKey="activeKey"
                            @change="handleFilterChange"
                            @reset="handleResetEvent"
                        ></PackageFilters>
                    </div>

                    <div class="flex flex-col">
                        <div class="px-6">
                            <a-input
                                size="large"
                                class="w-1/2"
                                v-model:value="queryText"
                                placeholder="Search Packages"
                                @change="handleSearchChange"
                            ></a-input>
                        </div>

                        <div class="px-6 py-2">
                            <AggregationTabs
                                :list="getAggregationByType"
                                v-model="postFacets.typeName"
                                @change="handlePackageTypeChange"
                            ></AggregationTabs>
                        </div>

                        <PackageList
                            :list="list"
                            class="px-6"
                            @select="handleSelect"
                            @dblClick="handleDoubleClick"
                        ></PackageList>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import PackageList from '@/packages/list/index.vue'
    import PackageFilters from '@/packages/filters/index.vue'
    import { packageFilters } from '~/constant/filters/packageFilters'
    import { usePackageDiscoverList } from '~/composables/package/usePackageDiscoverList'
    import { useDebounceFn } from '@vueuse/core'
    import { useRouter } from 'vue-router'
    import AggregationTabs from '@/common/tabs/aggregationTabs.vue'

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

            const router = useRouter()
            const handleBack = () => {
                router.push('/workflows')
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
                handleBack,
                router,
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
        background-size: cover;
        background-position: 50%;
        background-repeat: no-repeat;
    }
</style>
