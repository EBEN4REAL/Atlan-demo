<template>
    <FilterStrip />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import FilterStrip from './filterStrip.vue'

    export default defineComponent({
        name: 'MonitorWorkflows',
        components: { FilterStrip },
        props: {},
        emits: [],
        setup() {
            return {}
        },
    })
</script>
