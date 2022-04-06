<template>
    <div
        class="flex flex-col w-full px-5 py-4 bg-white gap-y-4"
        style="transition: height 300ms"
        :class="isExpanded ? 'h-28' : 'h-16'"
    >
        <div class="flex items-center w-full gap-x-4">
            <PackageSelector v-model:value="packageId" />
            <WorkflowSelector
                v-model:value="workflowId"
                :package-name="packageId"
                :disabled="!packageId"
            />

            <!-- <PackageWorkflowSelector
                v-model:packageId="packageId"
                v-model:workflowId="workflowId"
            /> -->
            <!-- <StatusSelector v-model:value="status" /> -->
            <TabbedStatusSelector v-model:value="status" class="raised" />

            <TabbedDateRangePicker
                v-model:value="runDateRange"
                class="raised"
            />

            <!-- TODO: Enable when additional filters come in -->
            <IconButton
                icon="ChevronDown"
                class="ml-auto rounded-full shadow-none"
                :class="{ '-rotate-180 transform': isExpanded }"
                @click="isExpanded = !isExpanded"
            />
        </div>
        <div class="flex items-center" :class="{ hidden: !isExpanded }">
            <!-- Space for additional filters -->
            <CreatorSelector v-model:value="creators" />
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
    import { runFilter } from '~/workflowsv2/constants/filters'

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
            const runDateRange = computed(computedFactory('dateRange'))

            const creators = computed(computedFactory('creators'))

            return {
                runDateRange,
                isExpanded,
                packageId,
                workflowId,
                runFilter,
                creators,
                activeKey,
                status,
            }
        },
    })
</script>
<style lang="less" scoped>
    .raised {
        box-shadow: 0px 1px 0px 0px #0000000d;
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
