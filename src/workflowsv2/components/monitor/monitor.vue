<template>
    <div class="flex flex-col overflow-hidden">
        <FilterStrip v-model:filters="filters" />

        <div class="flex flex-col p-5 overflow-y-auto gap-y-4">
            <RunHistoryTable v-model:filters="filters" />
            <DashboardComponent :widgets="Metadata" />
        </div>
    </div>
</template>

<script lang="ts">
    import { useHead } from '@vueuse/head'
    import { defineComponent, provide, ref } from 'vue'
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
            useHead({
                title: 'Monitor Workflows',
            })
            const filters = ref({})
            provide('monitorFilters', filters)
            return { filters, Metadata }
        },
    })
</script>
