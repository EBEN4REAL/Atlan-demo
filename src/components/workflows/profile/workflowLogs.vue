<template>
    <a-drawer
        :visible="isOpen"
        :closable="false"
        :width="720"
        :body-style="{ paddingBottom: '80px' }"
        @close="$emit('close')"
    >
        <div class="flex items-center justify-between p-4">
            <h1 class="text-lg font-bold">Classification Bot Logs</h1>
            <a-button size="small"
                >Download logs <AtlanIcon icon="ArrowDown" class="inline ml-2"
            /></a-button>
        </div>
        <div class="px-4 pb-4">
            <div class="p-4 bg-gray-100 rounded-md"></div>
        </div>
        <pre>{{ status }}</pre>
    </a-drawer>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import useWorkflowLogsStream from '~/composables/bots/useWorkflowLogsStream'

    export default defineComponent({
        props: { isOpen: { type: Boolean, default: false } },
        emits: ['close'],
        setup(props) {
            const { initLogs, status } = useWorkflowLogsStream()
            initLogs()
            return {
                initLogs,
                status,
            }
        },
    })
</script>
