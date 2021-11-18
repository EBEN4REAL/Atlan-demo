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
                                        {{ item.label }}</a-radio
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
                            class="flex items-center inline-block mr-3 text-gray-500 "
                        >
                            {{ currDepth }}
                            <AtlanIcon
                                icon="CaretRight"
                                class="ml-1 transform rotate-90 outline-none"
                            ></AtlanIcon>
                        </span>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item
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
                    <template v-if="selectedNodeType" #title>
                        <span> show impacted assets </span>
                    </template>
                    <AtlanIcon
                        icon="ImpactedAssets"
                        class="ml-3 outline-none"
                        :class="
                            selectedNodeType
                                ? 'text-primary'
                                : 'text-gray-500 cursor-not-allowed'
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
            selectedNodeType: {
                type: String,
                required: true,
            },
        },
        emits: ['show-process', 'show-impacted-assets', 'show-add-lineage'],
        setup(props, { emit }) {
            /** INJECTIONS */
            const depth = inject('depth') // TODO:
            const direction = inject('direction')
            const control = inject('control')

            /** DATA */
            const { selectedNodeType } = toRefs(props)
            const showSearch = ref(false)
            const showProcess = ref(false)
            const lineageDepths = [
                { id: 1, label: 'Depth 1' },
                { id: 2, label: 'Depth 2' },
                { id: 3, label: 'Depth 3' },
                { id: 21, label: 'Maximum' },
            ]
            const lineageDirections = [
                { id: 'BOTH', label: 'Both Direction' },
                { id: 'INPUT', label: 'Upstream' },
                { id: 'OUTPUT', label: 'Downstream' },
            ]
            const currDepth = computed(
                () => lineageDepths.find((x) => x.id === depth.value)?.label
            )

            /** METHODS */
            // onShowImpactedAssets
            const onShowImpactedAssets = () => {
                if (!selectedNodeType.value) return
                emit('show-impacted-assets')
            }

            // onShowProcess
            const onShowProcess = () => {
                emit('show-process', showProcess.value)
            }

            // onChangeDirection
            const onChangeDirection = (e) => {
                control('direction', e.target.value)
            }

            // onChangeDepth
            const onChangeDepth = (depth) => {
                control('depth', depth)
            }

            return {
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
