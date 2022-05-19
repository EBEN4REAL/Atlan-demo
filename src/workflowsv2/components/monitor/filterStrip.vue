<template>
    <div class="flex flex-col w-full h-16">
        <div
            class="z-10 flex items-center w-full px-5 py-4 border-b gap-x-4"
            style="
                background-color: #f9fafc;
                box-shadow: 0px 2px 2px 0px #0000000d;
            "
        >
            <PackageSelector v-model:value="packageId" />
            <WorkflowSelector
                v-model:value="workflowId"
                :package-name="packageId"
                :disabled="!packageId"
            />

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
            const runDateRange = computed(computedFactory('dateRange'))

            return {
                runDateRange,
                packageId,
                workflowId,
                activeKey,
            }
        },
    })
</script>
