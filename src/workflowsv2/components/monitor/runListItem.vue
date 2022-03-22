<template>
    <div class="run-list-item">
        <div class="flex flex-col items-start col-span-5">
            <span>{{ run.metadata.name }}</span>
        </div>
        <div class="col-span-1">{{ run.status.phase }}</div>
        <div class="col-span-1">{{ run.status.startedAt }}</div>
        <div class="col-span-1">{{ run.status.finishedAt }}</div>
        <div class="col-span-2">Output</div>
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
<style lang="less" scoped>
    .run-list-item {
        height: 70px;
        @apply px-3;
        @apply grid grid-cols-10;
    }
</style>
