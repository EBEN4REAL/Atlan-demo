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
                        :class="showSearch ? 'mr-2' : 'mr-5'"
                        class="outline-none"
                        @click="showSearch = !showSearch"
                    ></AtlanIcon>
                </a-tooltip>
                <LineageSearch v-if="showSearch" />
            </div>
            <div class="cursor-pointer">
                <a-tooltip placement="top">
                    <template #title>
                        <span>filter graph</span>
                    </template>
                    <a-dropdown :trigger="['click']">
                        <AtlanIcon
                            icon="Filter"
                            class="mr-5 outline-none"
                        ></AtlanIcon>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item
                                    v-for="item in lineageDirections"
                                    :key="item.id"
                                >
                                    <a-radio
                                        :value="item.id"
                                        :checked="direction === item.id"
                                        @change="onChangeDirection"
                                    >
                                        {{
                                            item.id === 'BOTH'
                                                ? 'Both Direction'
                                                : item.label
                                        }}</a-radio
                                    >
                                </a-menu-item>

                                <a-menu-divider />

                                <a-menu-item>
                                    <a-checkbox
                                        v-model:checked="showProcess"
                                        @change="onShowProcess"
                                        >Show Process</a-checkbox
                                    >
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </a-tooltip>
            </div>
            <div class="cursor-pointer">
                <a-tooltip placement="top">
                    <template #title>
                        <span>change depth</span>
                    </template>
                    <a-dropdown :trigger="['click']">
                        <span
                            class="flex items-center inline-block mr-3 text-gray-500"
                        >
                            {{ currDepth }}
                            <AtlanIcon
                                icon="CaretRight"
                                class="ml-1 transform rotate-90 outline-none"
                            ></AtlanIcon>
                        </span>
                        <template #overlay>
                            <a-menu class="lineage-header-menu">
                                <a-menu-item
                                    :class="{
                                        'ant-dropdown-menu-item-activee':
                                            depth === item.id,
                                    }"
                                    v-for="item in lineageDepths"
                                    :key="item.id"
                                    @click="onChangeDepth(item.id)"
                                >
                                    {{ item.label }}
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </a-tooltip>
            </div>
            <a-divider type="vertical" />
            <div class="cursor-pointer" @click="onShowImpactedAssets()">
                <a-tooltip placement="top">
                    <template #title>
                        <span> show impacted assets </span>
                    </template>
                    <AtlanIcon
                        icon="ImpactedAssets"
                        class="ml-3 outline-none"
                        :class="
                            isLeafNode
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
            /** INJECTIONS */
            /** INJECTIONS */
            const control = inject('control')
            const showProcess = inject('showProcess')
            const depth = inject('depth')
            const direction = inject('direction')
            const lineageDepths = inject('lineageDepths')
            const lineageDirections = inject('lineageDirections')

            /** DATA */
            const { highlightedNode, baseEntityGuid, graph } = toRefs(props)
            const showSearch = ref(false)
            const currDepth = computed(
                () => lineageDepths.find((x) => x.id === depth.value)?.label
            )

            const isLeafNode = computed(() => {
                const id = highlightedNode.value || baseEntityGuid.value
                const cell = graph.value.getCellById(id)
                return graph.value.isLeafNode(cell)
            })

            /** METHODS */
            // onShowImpactedAssets
            const onShowImpactedAssets = () => {
                if (isLeafNode.value) return
                emit('show-impacted-assets')
            }

            // onShowProcess
            const onShowProcess = () => {
                control('showProcess', showProcess.value)
            }

            // onChangeDirection
            const onChangeDirection = (e) => {
                control('direction', e.target.value)
            }

            // onChangeDepth
            const onChangeDepth = (d) => {
                control('depth', d)
            }

            return {
                isLeafNode,
                emit,
                currDepth,
                depth,
                direction,
                control,
                showSearch,
                showProcess,
                lineageDepths,
                lineageDirections,
                onShowImpactedAssets,
                onShowProcess,
                onChangeDirection,
                onChangeDepth,
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
