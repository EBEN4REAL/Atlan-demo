<template>
    <a-tooltip
        placement="bottom"
        title="View Slack Threads"
        :align="{ offset: [0, -5] }"
    >
        <div
            class="inline-block text-new-gray-800 py-1.5 px-2 mx-5 my-2 rounded cursor-pointer text-xs bg-new-gray-100 group hover:bg-new-gray-200"
            style="box-shadow: 0px 1px 0px rgba(0, 0, 0, 0.05)"
            @click="$emit('switchTab')"
        >
            <span class="">
                <AtlanIcon icon="Slack" class="h-4" /> Slack threads
            </span>
            <span
                class="p-1 rounded group-hover:bg-new-gray-300 bg-new-gray-200 text-new-gray-600"
            >
                {{ slackLinkCount }}
            </span>
        </div>
    </a-tooltip>
</template>

<script setup lang="ts">
    const emit = defineEmits(['switchTab'])

    const props = defineProps({
        slackLinkCount: { type: Number, default: 0 },
    })
</script>

<style scoped></style>
