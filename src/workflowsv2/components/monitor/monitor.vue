<template>
    <div>
        <FilterStrip />

        <div class="flex flex-col m-5">
            <RunHistoryTable />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import FilterStrip from './filterStrip.vue'
    import RunHistoryTable from './runHistoryTable.vue'

    export default defineComponent({
        name: 'MonitorWorkflows',
        components: { FilterStrip, RunHistoryTable },
        props: {},
        emits: [],
        setup() {
            return {}
        },
    })
</script>
