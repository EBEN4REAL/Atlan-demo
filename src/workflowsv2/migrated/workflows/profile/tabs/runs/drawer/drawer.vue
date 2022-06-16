<template>
    <a-drawer
        :key="selectedRun?.name"
        v-model:visible="visibleComp"
        placement="right"
        :closable="true"
        :mask="false"
        :get-container="false"
        :style="{ position: 'absolute' }"
    >
        <template #title>
            <span class="font-semibold line-clamp-1">{{
                selectedPod?.name
            }}</span>
        </template>
        <a-tabs
            v-model:activeKey="activeKey"
            class="flex-1"
            :destroy-inactive-tab-pane="true"
        >
            <template v-for="tab in tabs">
                <a-tab-pane
                    v-if="!tab.exclude?.includes(selectedPod?.type)"
                    :key="tab.id"
                    :tab="tab.label"
                >
                    <component
                        :is="tab.component"
                        :key="tab.id"
                        :selected-pod="selectedPod"
                        :selected-run="selectedRun"
                    />
                </a-tab-pane>
            </template>
        </a-tabs>
    </a-drawer>
</template>

<script lang="ts">
    // Vue
    import { computed, defineComponent, ref, toRefs } from 'vue'
    import Overview from './overview.vue'
    import Outputs from './outputs.vue'

    export default defineComponent({
        name: 'NodeDrawer',
        components: {
            Overview,
            Outputs,
        },
        props: {
            selectedPod: {
                type: Object,
                required: false,
                default: () => ({}),
            },
            selectedRun: {
                type: Object,
                required: true,
            },
            visible: {
                type: Boolean,
                required: true,
            },
        },
        emits: ['update:visible'],
        setup(props, { emit }) {
            const { visible } = toRefs(props)
            const activeKey = ref('overview')

            const visibleComp = computed({
                get: () => visible.value,
                set: (val) => emit('update:visible', val),
            })

            const tabs = [
                { id: 'overview', component: 'Overview', label: 'Overview' },
                {
                    id: 'outputs',
                    component: 'Outputs',
                    label: 'Outputs',
                    exclude: ['DAG', 'Skipped'],
                },
            ]
            return { visibleComp, tabs, activeKey }
        },
    })
</script>
