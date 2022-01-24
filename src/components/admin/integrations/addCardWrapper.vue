<template>
    <Slack v-if="integrationTypeObject.name === 'slack'" />
</template>

<script setup lang="ts">
    import Slack from './slack/index.vue'

    const props = defineProps({
        integrationTypeObject: { type: Object, required: true },
    })
</script>

<style scoped></style>
