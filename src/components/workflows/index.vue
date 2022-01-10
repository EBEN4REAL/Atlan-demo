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
