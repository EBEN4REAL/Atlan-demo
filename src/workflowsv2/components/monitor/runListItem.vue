<template>
    <div class="run-list-item">
        <div style="flex-grow: 5" class="flex flex-col">
            <div class="flex items-center truncate gap-x-2">
                <img v-if="item.icon" :src="item.icon" class="w-auto h-4" />
                <span>{{ item.label }}</span>
            </div>
            <div class="flex"></div>
        </div>
        <div style="flex-grow: 1"></div>
        <div style="flex-grow: 1"></div>
        <div style="flex-grow: 1"></div>
        <div style="flex-grow: 2"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { LiveRun } from '~/types/workflow/runs.interface'

    export default defineComponent({
        name: 'RunListItem',
        components: {},
        props: {
            run: {
                type: Object as PropType<LiveRun>,
                required: true,
            },
        },
        emits: [],
        setup() {},
    })
</script>
<style scoped>
    .run-list-item {
        height: 70px;
        @apply flex items-center;
    }
</style>
