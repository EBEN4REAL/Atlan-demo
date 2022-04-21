<template>
    <div
        class="p-2 mx-5 my-2 text-xs border border-gray-200 rounded bg-gray-50"
    >
        <span
            class="cursor-pointer hover:underline"
            @click="$emit('switchTab')"
        >
            Click here to view
            <AtlanIcon icon="Slack" class="h-3" /> Slack threads
        </span>
    </div>
</template>

<script setup lang="ts">
    const emit = defineEmits(['switchTab'])
</script>

<style scoped></style>
