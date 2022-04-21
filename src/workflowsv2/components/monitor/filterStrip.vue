<template>
    <div class="flex flex-col w-full h-28">
        <div
            class="flex items-center w-full px-5 py-4 bg-white border-b gap-x-4"
        >
            <PackageSelector v-model:value="packageId" />
            <WorkflowSelector
                v-model:value="workflowId"
                :package-name="packageId"
                :disabled="!packageId"
            />
            <CreatorSelector v-model:value="creators" />
        </div>
        <div class="flex items-center px-5 py-4 gap-x-3">
            <!-- <PackageWorkflowSelector
                v-model:packageId="packageId"
                v-model:workflowId="workflowId"
            /> -->
            <!-- <StatusSelector v-model:value="status" /> -->
            <span>Run Status</span>
            <TabbedStatusSelector v-model:value="status" />

            <span class="ml-1">Run Start Time</span>
            <TabbedDateRangePicker v-model:value="runDateRange" />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import WorkflowSelector from '~/workflowsv2/components/common/selectors/workflowSelector.vue'
    import PackageSelector from '~/workflowsv2/components/common/selectors/packageSelector.vue'
    // import PackageWorkflowSelector from '~/workflowsv2/components/common/selectors/packageWorkflowSelector.vue'
    // import StatusSelector from '~/workflowsv2/components/common/selectors/statusSelector.vue'
    import TabbedDateRangePicker from '~/workflowsv2/components/common/selectors/tabbedDateRangePicker.vue'
    import TabbedStatusSelector from '~/workflowsv2/components/common/selectors/tabbedStatusSelector.vue'
    import CreatorSelector from '~/workflowsv2/components/common/selectors/creatorSelector.vue'

    export default defineComponent({
        name: 'FilterStrip',
        components: {
            WorkflowSelector,
            PackageSelector,
            // PackageWorkflowSelector,
            // StatusSelector,
            TabbedDateRangePicker,
            TabbedStatusSelector,
            CreatorSelector,
        },
        props: {
            filters: {
                type: Object,
                default: () => {},
            },
        },
        emits: ['update:filters'],
        setup(props, { emit }) {
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
            const runDateRange = computed(computedFactory('dateRange'))

            const creators = computed(computedFactory('creators'))

            return {
                runDateRange,
                packageId,
                workflowId,
                creators,
                activeKey,
                status,
            }
        },
    })
</script>

<style lang="less" module>
    .request-filter-wrapper {
        :global(.filter-head) {
            background: inherit !important;
            height: 52px;
            @apply pt-4 !important;
        }
    }
</style>
