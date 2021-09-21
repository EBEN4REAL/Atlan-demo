<template>
    <div>
        <LineageGraph />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import LineageGraph from './lineageGraph.vue'

    export default defineComponent({
        name: 'Lineage',
        components: {
            LineageGraph,
        },
    })
</script>
