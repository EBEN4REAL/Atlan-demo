<template>
    <!-- connect with jira banner -->
    <div class="flex flex-col px-4 py-3 mb-2 bg-primary-light">
        <h1 class="mb-1 font-bold text-gray-700">Connect with Jira</h1>
        <span class="mb-3 text-xs text-gray-500 w-52">
            {{ description }}
        </span>
        <div
            class="flex cursor-pointer items-center px-2 py-1.5 text-xs text-white bg-gray-800 rounded gap-x-1"
            style="width: 82px"
            @click="handleConnect"
        >
            <AtlanIcon
                icon="Jira"
                style="height: 14px"
                :loading="configLoading"
            />
            Connect
        </div>
    </div>
</template>

<script setup lang="ts">
    import { connectJira } from '~/composables/integrations/jira/useJira'

    const props = defineProps({
        description: {
            type: String,
            default:
                'To create and link issues to assets connect your Jira account with Atlan',
        },
    })

    const { isLoading: configLoading, connect: handleConnect } = connectJira({
        tenant: false,
    })
</script>

<style scoped></style>
