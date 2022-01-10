<template>
    <PackagePreview
        v-if="item?.kind === 'ClusterWorkflowTemplate'"
        :item="item"
    ></PackagePreview>
    <WorkflowPreview
        v-if="item?.kind === 'WorkflowTemplate'"
        :item="item"
    ></WorkflowPreview>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    import PackagePreview from '~/components/workflows/package/preview/index.vue'
    import WorkflowPreview from '~/components/workflows/workflows/preview/index.vue'

    export default defineComponent({
        name: 'WorkflowDiscovery',
        components: {
            PackagePreview,
            WorkflowPreview,
        },
        props: {
            item: {
                type: Object,
                required: false,
                default: () => {},
            },
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
