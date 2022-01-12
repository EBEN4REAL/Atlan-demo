<template>
    <div class="lineage-control header">
        <div class="controls">
            <div
                class="flex items-center control-item"
                @click="showSearch = !showSearch"
            >
                <a-tooltip placement="top">
                    <template #title>
                        <span>search graph</span>
                    </template>
                    <AtlanIcon
                        icon="Search"
                        class="mx-1 my-2 outline-none"
                    ></AtlanIcon>
                </a-tooltip>
            </div>
            <LineageSearch v-if="showSearch" @select="fit" />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ref, computed, toRefs } from 'vue'

    // Components
    import LineageSearch from './lineageSearch.vue'
    import useTransformGraph from './useTransformGraph'

    export default defineComponent({
        name: 'LineageHeader',
        components: { LineageSearch },
        props: {
            isCyclic: {
                type: Boolean,
                required: true,
            },
            baseEntityGuid: {
                type: String,
                required: true,
            },
            highlightedNode: {
                type: String,
                required: true,
            },
            graph: {
                type: Object,
                required: true,
            },
        },
        emits: ['show-process', 'show-impacted-assets', 'show-add-lineage'],
        setup(props, { emit }) {
            /** DATA */
            const { highlightedNode, baseEntityGuid, graph } = toRefs(props)
            const showSearch = ref(false)
            const { fit } = useTransformGraph(graph, emit)

            const isLeafNode = computed(() => {
                const id = highlightedNode.value || baseEntityGuid.value
                const cell = graph.value.getCellById(id)
                return graph.value.isLeafNode(cell)
            })

            return {
                isLeafNode,
                emit,
                showSearch,
                fit,
            }
        },
    })
</script>
