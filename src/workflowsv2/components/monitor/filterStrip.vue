<template>
    <a-drawer
        v-model:visible="isDrawerVisible"
        mask
        mask-closable
        placement="left"
        class="drawer-filter-runs"
        :width="240"
        :closable="false"
    >
        <div
            class="relative h-full pb-10 overflow-scroll bg-gray-50"
            :class="$style['request-filter-wrapper']"
        >
            <div
                v-if="isDrawerVisible"
                class="close-btn-sidebar button-close-drawer-run"
                @click="isDrawerVisible = false"
            >
                <AtlanIcon icon="Add" class="text-white" />
            </div>

            <AssetFilters
                v-model="drawerFilters"
                v-model:activeKey="activeKey"
                :filter-list="runFilter"
                :allow-custom-filters="false"
                :no-filter-title="'No filters applied'"
                class="drawer-request"
                @change="handleFilterChange"
                @reset="handleResetEvent"
            />
        </div>
    </a-drawer>
    <div
        class="flex flex-col w-full px-5 py-4 bg-white gap-y-4"
        style="transition: height 300ms"
        :class="isExpanded ? 'h-28' : 'h-16'"
    >
        <div class="flex items-center w-full gap-x-4">
            <AtlanButton2
                color="secondary"
                :prefix-icon="
                    drawerFiltersApplied ? 'FilterFunnelDot' : 'FilterFunnel'
                "
                label="Filters"
                @click="isDrawerVisible = !isDrawerVisible"
            />
            <PackageSelector v-model:value="packageId" />
            <StatusSelector v-model:value="status" />

            <TabbedDateRangePicker v-model:value="runDateRange" />
            <IconButton
                icon="ChevronDown"
                class="ml-auto rounded-full shadow-none"
                :class="{ '-rotate-180 transform': isExpanded }"
                @click="isExpanded = !isExpanded"
            />
        </div>
        <div class="flex items-center" :class="{ hidden: !isExpanded }">
            <WorkflowSelector
                v-model:value="workflowId"
                :package-name="packageId"
                :disabled="!packageId"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import PackageSelector from '~/workflowsv2/components/common/packageSelector.vue'
    import WorkflowSelector from '~/workflowsv2/components/common/workflowSelector.vue'
    import StatusSelector from '~/workflowsv2/components/common/statusSelector.vue'
    import TabbedDateRangePicker from '~/workflowsv2/components/common/tabbedDateRangePicker.vue'
    import { runFilter } from '~/workflowsv2/constants/filters'

    export default defineComponent({
        name: 'FilterStrip',
        components: {
            PackageSelector,
            WorkflowSelector,
            StatusSelector,
            TabbedDateRangePicker,
            AssetFilters,
        },
        props: {
            filters: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['update:filters'],
        setup(props, { emit }) {
            const isDrawerVisible = ref(false)
            const isExpanded = ref(false)
            const activeKey = ref([])
            const { filters } = toRefs(props)

            const setFilter = (key: string, value: any) => {
                const tmpFilter = filters.value
                tmpFilter[key] = value
                emit('update:filters', tmpFilter)
            }

            const computedFactory = (key: string) => ({
                get: () => filters.value?.[key],
                set: (val: any) => setFilter(key, val),
            })

            const packageId = computed(computedFactory('packageId'))
            const workflowId = computed(computedFactory('workflowId'))
            const status = computed(computedFactory('status'))
            const runDateRange = computed(computedFactory('startDate'))
            const drawerFilters = computed(computedFactory('sidebar'))

            const drawerFiltersApplied = computed(() => {
                if (!drawerFilters.value) return false

                // eslint-disable-next-line no-restricted-syntax
                for (const value of Object.values(drawerFilters.value)) {
                    if (value) return true
                }

                return false
            })

            const handleResetEvent = () => {
                drawerFilters.value = {}
            }

            const handleFilterChange = () => {}

            return {
                runDateRange,
                isDrawerVisible,
                isExpanded,
                packageId,
                workflowId,
                runFilter,
                drawerFilters,
                activeKey,
                handleResetEvent,
                handleFilterChange,
                drawerFiltersApplied,
                status,
            }
        },
    })
</script>
<style lang="less" scoped>
    .drawer-filter-runs {
        .ant-drawer-content-wrapper {
            width: 240px !important;
        }
    }
    .button-close-drawer-run {
        left: 260px !important;
        top: 12px;
    }
    .drawer-request {
        @apply bg-gray-100;

        .ant-collapse-content {
            background: none !important;
        }
        .ant-collapse-header {
            @apply hover:bg-transparent !important;
        }
        .group {
            background: none !important;
        }
    }
</style>

<style lang="less" module>
    .request-filter-wrapper {
        :global(.filter-head) {
            background: inherit !important;
            height: 52px;
            @apply pt-4 !important;
        }
    }
</style>
