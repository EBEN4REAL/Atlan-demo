<template>
    <span class="flex items-center gap-x-1">
        Question posted.
        <template v-if="link">
            <component :is="Slack" class="h-3.5" />
            <a :href="link" target="_blank" class="text-primary hover:underline"
                >Open in Slack</a
            >
            <component :is="ArrowRight" class="h-3.5 text-primary" />
        </template>
    </span>
</template>

<script setup lang="ts">
    import Slack from '~/assets/images/admin/integrations/slack.svg'
    import ArrowRight from '~/assets/images/icons/arrow-right.svg'

    const props = defineProps({
        link: { type: String, default: '' },
    })
</script>

<style scoped></style>
