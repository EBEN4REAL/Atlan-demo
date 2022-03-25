<template>
    <div>
        <FilterStrip v-model:filters="filters" />

        <div class="flex flex-col m-5">
            <RunHistoryTable v-model:filters="filters" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import FilterStrip from './filterStrip.vue'
    import RunHistoryTable from './runHistoryTable.vue'

    export default defineComponent({
        name: 'MonitorWorkflows',
        components: { FilterStrip, RunHistoryTable },
        props: {},
        emits: [],
        setup() {
            const filters = ref({})
            return { filters }
        },
    })
</script>
