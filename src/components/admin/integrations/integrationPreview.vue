<!--Add previews for all integrations here-->
<template>
    <div><SlackWrapper v-if="selectedIntegrationId === 'slack'" /></div>
</template>
<script>
import { defineComponent } from 'vue'
import SlackWrapper from '@/admin/integrations/slack/slackWrapper.vue'

export default defineComponent({
    name: 'IntegartionPreview',
    components: { SlackWrapper },
    props: {
        selectedIntegrationId: {
            type: String,
            default: '',
        },
    },
})
</script>

<style>
</style>