<template>
    <span class="flex items-center gap-x-1">
        <AtlanIcon class="h-5 mr-1" :icon="'AtlanIcon'"></AtlanIcon>
        {{ featureName }} enabled. Please send feedback to nearest Atlanian 🧪
    </span>
</template>

<script setup lang="ts">
    import Slack from '~/assets/images/admin/integrations/slack.svg'
    import ArrowRight from '~/assets/images/icons/arrow-right.svg'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

    const props = defineProps({
        featureName: { type: String, required: true },
    })
</script>

<style scoped></style>
