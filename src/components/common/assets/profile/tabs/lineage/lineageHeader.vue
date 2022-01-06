<template>
    <div class="lineage-control header">
        <div class="controls">
            <div class="flex items-center cursor-pointer">
                <a-tooltip placement="top">
                    <template #title>
                        <span>search graph</span>
                    </template>
                    <AtlanIcon
                        icon="Search"
                        class="mr-2 outline-none"
                        @click="showSearch = !showSearch"
                    ></AtlanIcon>
                </a-tooltip>
                <LineageSearch v-if="showSearch" />
            </div>
            <a-divider type="vertical" />
            <div class="cursor-pointer" @click="onShowImpactedAssets()">
                <a-tooltip placement="top">
                    <template #title>
                        <span> show impacted assets </span>
                    </template>
                    <AtlanIcon
                        icon="ImpactedAssets"
                        class="outline-none"
                        :class="
                            isLeafNode || !highlightedNode
                                ? 'text-gray-500 cursor-not-allowed'
                                : 'text-primary'
                        "
                    ></AtlanIcon>
                </a-tooltip>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ref, inject, computed, toRefs } from 'vue'

    // Components
    import LineageSearch from './lineageSearch.vue'

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
                required: true,
            },
        },
        emits: ['show-process', 'show-impacted-assets', 'show-add-lineage'],
        setup(props, { emit }) {
            /** DATA */
            const { highlightedNode, baseEntityGuid, graph } = toRefs(props)
            const showSearch = ref(false)

            const isLeafNode = computed(() => {
                const id = highlightedNode.value || baseEntityGuid.value
                const cell = graph.value.getCellById(id)
                return graph.value.isLeafNode(cell)
            })

            /** METHODS */
            // onShowImpactedAssets
            const onShowImpactedAssets = () => {
                if (!highlightedNode.value) return
                if (isLeafNode.value) return
                emit('show-impacted-assets')
            }

            return {
                isLeafNode,
                emit,
                showSearch,
                onShowImpactedAssets,
            }
        },
    })
</script>

<style lang="less">
    .cyclic-pill {
        background: #ffe6eb;
        padding: 0 8px;
        border-radius: 15px;
    }

    .lineage-header-menu {
        .ant-dropdown-menu-item-activee {
            background-color: #eaf0ff !important;
        }

        .ant-dropdown-menu-item:hover {
            background-color: #f8f8fd;
        }
    }
</style>
