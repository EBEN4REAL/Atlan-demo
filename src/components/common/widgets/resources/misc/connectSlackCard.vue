<template>
    <div
        class="flex items-center px-2 text-xs bg-gray-100 border rounded gap-x-2"
    >
        <div class="p-1 bg-white rounded">
            <AtlanIcon icon="Slack" class="h-3.5" />
        </div>
        <span>See rich preview for Slack links.</span>
        <span
            class="cursor-pointer text-primary hover:underline"
            @click="() => openSlackOAuth({ emit: $emit })"
        >
            Connect
        </span>
    </div>
</template>

<script setup lang="ts">
    import {
        isSlackLink,
        openSlackOAuth,
    } from '~/composables/integrations/slack/useSlack'
</script>

<style scoped></style>
