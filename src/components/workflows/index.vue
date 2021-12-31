<template>
    <div class="flex flex-col w-full h-full">
        <div class="flex flex-1 w-full overflow-y-auto">
            <div
                class="flex flex-col bg-gray-100 border-r border-gray-300 filters"
            >
                <PackageFilters
                    :filter-list="packageFilters"
                    v-model="facets"
                    v-model:activeKey="activeKey"
                    @change="handleFilterChange"
                    @reset="handleResetEvent"
                ></PackageFilters>
            </div>

            <div class="flex flex-col flex-1 h-full">
                <div
                    class="flex flex-col px-6 py-3 pb-4 font-extrabold focus-within:text-2xl"
                >
                    <a-input
                        size="large"
                        v-model:value="queryText"
                        placeholder="Search Packages"
                        @change="handleSearchChange"
                    ></a-input>
                </div>

                <div class="flex h-full overflow-y-auto">
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

                    <WorkflowList
                        v-else
                        :list="list"
                        class="px-6 mb-4"
                        @select="handleSelect"
                    ></WorkflowList>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, watch } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import WorkflowList from '@/workflows/list/index.vue'
    import PackageFilters from '@/packages/filters/index.vue'
    import { packageFilters } from '~/constant/filters/packageFilters'
    import { useWorkflowDiscoverList } from '~/composables/package/useWorkflowDiscoverList'
    import { useDebounceFn } from '@vueuse/core'
    import { usePackageDiscoverList } from '~/composables/package/usePackageDiscoverList'

    export default defineComponent({
        name: 'PackageDiscovery',
        components: {
            PackageFilters,
            WorkflowList,
            ErrorView,
            EmptyView,
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
                ui: true,
            })

            const preference = ref({
                sort: 'metadata.creationTimestamp-desc',
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

            const { isLoading, list, error, quickChange } =
                useWorkflowDiscoverList({
                    isCache: true,
                    dependentKey,
                    facets,
                    limit,
                    offset,
                    queryText,
                    source: ref({
                        excludes: ['spec'],
                    }),
                    preference,
                })

            const dependentKeyPackage = ref('')
            const { refresh } = usePackageDiscoverList({
                isCache: false,
                dependentKey: dependentKeyPackage,
                facets,
                limit,
                offset,
                queryText,
                source: ref({
                    excludes: ['spec'],
                }),
                preference,
            })

            watch(list, () => {
                console.log('changed list')
                refresh()
            })

            const handleFilterChange = () => {
                offset.value = 0

                quickChange()
            }

            const placeholder = computed(() => 'Search all packages')

            const selectedPackage = ref<any>(null)

            const handleSelect = (item) => {
                selectedPackage.value = item
                emit('select', item)
            }

            const handleSearchChange = useDebounceFn(() => {
                offset.value = 0
                quickChange()
            }, 150)

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
                preference,
                refresh,
                dependentKeyPackage,
            }
        },
    })
</script>

<style lang="less">
    .filters {
        max-width: 264px;
        width: 25%;
    }
</style>
