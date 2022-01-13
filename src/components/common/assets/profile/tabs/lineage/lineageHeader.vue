<template>
    <div class="lineage-control header">
        <LineageSearch class="controls" @select="fit" />
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, toRefs } from 'vue'

    // Components
    import LineageSearch from './lineageSearch.vue'
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
            const { fit } = useTransformGraph(graph, emit)

            return {
                emit,
                fit,
            }
        },
    })
</script>
