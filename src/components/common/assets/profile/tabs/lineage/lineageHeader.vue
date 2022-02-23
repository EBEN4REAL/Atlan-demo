<template>
    <div class="lineage-control header">
        <LineageSearch class="controls" @select="fit" />
    </div>
</template>

<script lang="ts">
    /** VUE */
    import { defineComponent, toRefs } from 'vue'

    /** COMPONENTS */
    import LineageSearch from './lineageSearch.vue'

    /** COMPOSABLES */
    import useTransformGraph from './useTransformGraph'

    export default defineComponent({
        name: 'LineageHeader',
        components: { LineageSearch },
        props: {
            graph: {
                type: Object,
                required: true,
            },
        },
        emits: ['show-process', 'show-impacted-assets', 'show-add-lineage'],
        setup(props, { emit }) {
            /** DATA */
            const { graph } = toRefs(props)

            /** METHODS */
            // useTransformGraph
            const { fit } = useTransformGraph(graph, emit)

            return {
                emit,
                fit,
            }
        },
    })
</script>
