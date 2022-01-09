<template>
    <div class="flex flex-col w-full h-full bg-primary-light">
        <div class="flex flex-1 w-full overflow-y-auto">
            <div class="flex flex-col flex-1 h-full">
                <div class="flex items-center justify-between px-6 py-6">
                    <a-radio-group
                        button-style="solid"
                        v-model:value="discoveryType"
                    >
                        <a-radio-button value="packages"
                            >Packages</a-radio-button
                        >
                        <a-radio-button value="workflows"
                            >Workflows</a-radio-button
                        >
                    </a-radio-group>
                    <a-button type="primary">New Workflow</a-button>
                </div>
                <div
                    class="flex px-6 pb-4 font-extrabold gap-x-3 focus-within:text-2xl"
                >
                    <a-popover placement="bottomRight">
                        <template #content>
                            <PackageFilters
                                :filter-list="packageFilters"
                                v-model="facets"
                                v-model:activeKey="activeKey"
                                @change="handleFilterChange"
                                @reset="handleResetEvent"
                            ></PackageFilters>
                        </template>
                        <a-button
                            ><AtlanIcon icon="Filter" class="mr-1"></AtlanIcon
                            >Filter</a-button
                        >
                    </a-popover>
                    <a-input
                        v-model:value="queryText"
                        placeholder="Search Packages"
                        @change="handleSearchChange"
                    ></a-input>
                </div>

                <div class="flex h-full overflow-y-auto">
                    <!-- <div
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
                    </div> -->

                    <PackageWiseDiscovery
                        v-if="discoveryType === 'packages'"
                    ></PackageWiseDiscovery>
                    <WorkflowWiseDiscovery
                        v-if="discoveryType === 'workflows'"
                    ></WorkflowWiseDiscovery>
                    <!-- <WorkflowList
                        :list="list"
                        class="px-6 mb-4"
                        @select="handleSelect"
                    ></WorkflowList>
                    {{ packageListFromWorkflows }} -->
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, watch, provide } from 'vue'
    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'

    import PackageFilters from '@/packages/filters/index.vue'
    import { packageFilters } from '~/constant/filters/packageFilters'

    import PackageWiseDiscovery from '~/components/workflows/package/index.vue'
    import WorkflowWiseDiscovery from '~/components/workflows/workflows/index.vue'

    export default defineComponent({
        name: 'WorkflowDiscovery',
        components: {
            PackageFilters,

            ErrorView,
            EmptyView,
            PackageWiseDiscovery,
            WorkflowWiseDiscovery,
        },
        emits: ['setup', 'sandbox', 'select'],
        setup(props, { emit }) {
            const activeKey = ref(['sourceCategory_0'])

            const discoveryType = ref('packages')

            // const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)
            // const searchDirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            // const handleSetup = (item) => {
            //     emit('setup', selectedPackage.value)
            // }
            // const handleSetupSandbox = (item) => {
            //     emit('sandbox', selectedPackage.value)
            // }

            // const limit = ref(0)
            // const offset = ref(0)
            // const queryText = ref('')
            // const facets = ref({
            //     ui: true,
            // })
            // const dependentKey = ref('DEFAULT_PACKAGES')
            // const aggregationWorkflow = ref(['package'])
            // const {
            //     isLoading,
            //     error,
            //     quickChange,
            //     packageList: packageListFromWorkflows,
            // } = useWorkflowDiscoverList({
            //     isCache: true,
            //     dependentKey,
            //     facets,
            //     limit,
            //     offset,
            //     queryText,
            //     source: ref({
            //         excludes: ['spec'],
            //     }),
            //     aggregations: aggregationWorkflow,
            // })

            // const packageList = ref([])
            // const dependentKeyPackage = ref('')
            // const facetPackage = ref({})
            // const packageLimit = ref(20)
            // const packageOffset = ref(0)
            // const preference = ref({
            //     sort: 'metadata.creationTimestamp-desc',
            // })

            // watch(packageListFromWorkflows, () => {
            //     const map = Object.keys(packageListFromWorkflows.value)

            //     // const dedup = [...new Set(map)]
            //     // const existingPackageList = packageList.value.map((i) => {
            //     //     return i?.metadata.annotations['package.argoproj.io/name']
            //     // })
            //     // const newPackageList = dedup.filter((i) => {
            //     //     return !existingPackageList.includes(i)
            //     // })
            //     facetPackage.value = {
            //         packageNames: map,
            //     }
            //     quickChangePackage()
            //     // }
            //     // facetRun.value = {
            //     //     workflowTemplates: list.value.map(
            //     //         (item) => item.metadata.name
            //     //     ),
            //     // }
            //     // quickChangeRun()
            // })

            // const { quickChange: quickChangePackage, list } =
            //     usePackageDiscoverList({
            //         isCache: false,
            //         dependentKey: dependentKeyPackage,
            //         facets: facetPackage,
            //         limit: packageLimit,
            //         offset: packageOffset,
            //     })

            // // watch(packageFetchList, () => {
            // //     packageList.value = packageList.value.concat(
            // //         packageFetchList.value
            // //     )
            // // })

            // const dependentKeyRun = ref('')
            // const facetRun = ref({})
            // const aggregationRun = ref(['status'])
            // const { quickChange: quickChangeRun, runByWorkflowMap } =
            //     useRunDiscoverList({
            //         isCache: false,
            //         dependentKey: dependentKeyRun,
            //         facets: facetRun,
            //         limit: ref(0),
            //         offset,
            //         aggregations: aggregationRun,
            //         queryText,
            //         source: ref({
            //             excludes: ['spec'],
            //         }),
            //         preference,
            //     })

            // provide('runMap', runByWorkflowMap)
            // // watch(list, () => {
            // //     console.log('changed list')
            // //     facetRun.value = {
            // //         workflowTemplates: list.value.map(
            // //             (item) => item.metadata.name
            // //         ),
            // //     }
            // //     quickChangeRun()
            // // })

            // const handleFilterChange = () => {
            //     offset.value = 0

            //     quickChange()
            // }

            // const placeholder = computed(() => 'Search all packages')

            // const selectedPackage = ref<any>(null)

            // const handleSelect = (item) => {
            //     selectedPackage.value = item
            //     emit('select', item)
            // }

            // const handleSearchChange = useDebounceFn(() => {
            //     offset.value = 0
            //     quickChange()
            // }, 150)

            // const handleResetEvent = () => {
            //     facets.value = {
            //         verified: true,
            //     }
            //     queryText.value = ''
            //     handleFilterChange()
            //     dirtyTimestamp.value = `dirty_${Date.now().toString()}`
            //     searchDirtyTimestamp.value = `dirty_${Date.now().toString()}`
            // }

            return {
                packageFilters,
                discoveryType,
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
