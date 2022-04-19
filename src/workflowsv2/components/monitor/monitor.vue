<template>
    <div>
        <FilterStrip v-model:filters="filters" />

        <div class="flex flex-col m-5 gap-y-4">
            <RunHistoryTable v-model:filters="filters" />
            <DashboardComponent :widgets="Metadata" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { Metadata } from '~/workflowsv2/constants/widgets'

    import FilterStrip from './filterStrip.vue'
    import RunHistoryTable from './runHistoryTable.vue'
    import DashboardComponent from './widgets/dashboard.vue'

    export default defineComponent({
        name: 'MonitorWorkflows',
        components: { FilterStrip, RunHistoryTable, DashboardComponent },
        props: {},
        emits: [],
        setup() {
            const filters = ref({})
            return { filters, Metadata }
        },
    })
</script>
