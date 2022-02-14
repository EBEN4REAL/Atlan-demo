<template>
    <div
        class="flex flex-col items-center justify-center w-full h-full bg-primary-light"
    >
        <AtlanIcon icon="ErrorLogs" class="h-40"></AtlanIcon>
        <div class="mt-3 text-lg">
            We are not able to connect to Atlan - please reach out to
            <a href="mailto:support@atlan.com" class="underline text-primary"
                >support@atlan.com</a
            >
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'AtlanError',
    })
</script>
<route lang="yaml">
meta:
    layout: minimal
    requiresAuth: false
</route>
