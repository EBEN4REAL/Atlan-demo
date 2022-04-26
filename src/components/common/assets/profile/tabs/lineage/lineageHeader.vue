<template>
    <div class="lineage-control header">
        <LineageSearch class="controls" />
    </div>
</template>

<script lang="ts">
    /** VUE */
    import { defineComponent } from 'vue'

    /** COMPONENTS */
    import LineageSearch from './lineageSearch.vue'

    export default defineComponent({
        name: 'LineageHeader',
        components: { LineageSearch },
    })
</script>
