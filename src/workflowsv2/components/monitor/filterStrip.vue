<template>
    <a-drawer
        :visible="drawerFilter"
        :mask="false"
        :placement="'left'"
        :width="240"
        :closable="false"
        :class="'drawer-filter-runs'"
    >
        <div
            class="relative h-full pb-10 overflow-scroll bg-gray-50"
            :class="$style['request-filter-wrapper']"
        >
            <div
                v-if="drawerFilter"
                class="close-btn-sidebar button-close-drawer-run"
                @click="drawerFilter = false"
            >
                <AtlanIcon icon="Add" class="text-white" />
            </div>

            <AssetFilters
                v-model="drawerFilters"
                v-model:activeKey="activeKey"
                :filter-list="runFilter"
                :allow-custom-filters="false"
                :no-filter-title="'No filters applied'"
                class="bg-gray-100 drawer-request"
                @change="handleFilterChange"
                @reset="handleResetEvent"
            />
        </div>
    </a-drawer>
    <div class="flex items-center w-full h-16 px-5 bg-white gap-x-4">
        <AtlanButton2
            color="secondary"
            prefix-icon="FilterFunnel"
            label="Filters"
            @click="drawerFilter = !drawerFilter"
        />
        <PackageSelector v-model:value="packageId" />
        <WorkflowSelector
            v-model:value="workflowId"
            :package-name="packageId"
            :disabled="!packageId"
        />
        <TabbedDateRangePicker v-model:value="runDateRange" />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import PackageSelector from '~/workflowsv2/components/common/packageSelector.vue'
    import WorkflowSelector from '~/workflowsv2/components/common/workflowSelector.vue'
    import TabbedDateRangePicker from '~/workflowsv2/components/common/tabbedDateRangePicker.vue'
    import AssetFilters from '@/common/assets/filters/index.vue'
    import { runFilter } from '~/workflowsv2/constants/filters'

    export default defineComponent({
        name: 'FilterStrip',
        components: {
            PackageSelector,
            WorkflowSelector,
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
            const runDateRange = ref('Today')
            const drawerFilter = ref(false)
            const activeKey = ref([])
            const { filters } = toRefs(props)

            const packageId = computed({
                get: () => filters.value?.packageId,
                set: (val) => {
                    const tmpFilter = filters.value
                    tmpFilter.packageId = val
                    emit('update:filters', tmpFilter)
                },
            })

            const workflowId = computed({
                get: () => filters.value?.workflowId,
                set: (val) => {
                    const tmpFilter = filters.value
                    tmpFilter.workflowId = val
                    emit('update:filters', tmpFilter)
                },
            })

            const drawerFilters = computed({
                get: () => filters.value?.sidebar,
                set: (val) => {
                    const tmpFilter = filters.value
                    tmpFilter.sidebar = val
                    emit('update:filters', tmpFilter)
                },
            })

            const handleResetEvent = () => {
                drawerFilters.value = {}
            }

            const handleFilterChange = () => {}

            return {
                runDateRange,
                drawerFilter,
                packageId,
                workflowId,
                runFilter,
                drawerFilters,
                activeKey,
                handleResetEvent,
                handleFilterChange,
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
