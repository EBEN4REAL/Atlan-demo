<template>
    <PackagePreview></PackagePreview>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, watch, provide } from 'vue'

    import PackagePreview from '~/components/workflows/package/preview/index.vue'

    export default defineComponent({
        name: 'WorkflowDiscovery',
        components: {
            PackagePreview,
        },
        emits: ['setup', 'sandbox', 'select'],
        setup(props, { emit }) {},
    })
</script>

<style lang="less">
    .filters {
        max-width: 264px;
        width: 25%;
    }
</style>
