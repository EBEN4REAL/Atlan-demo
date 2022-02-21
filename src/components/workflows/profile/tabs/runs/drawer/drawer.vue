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
        <Overview :selected-pod="selectedPod" :selected-run="selectedRun" />
    </a-drawer>
</template>

<script lang="ts">
    // Vue
    import { computed, defineComponent, toRefs } from 'vue'
    import Overview from './overview.vue'

    export default defineComponent({
        name: 'NodeDrawer',
        components: {
            Overview,
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

            const visibleComp = computed({
                get: () => visible.value,
                set: (val) => emit('update:visible', val),
            })
            return { visibleComp }
        },
    })
</script>
