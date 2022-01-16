<template>
    <Slack v-if="integrationTypeObject.name === 'slack'" />
</template>

<script setup lang="ts">
    import { defineComponent } from 'vue'
    import Slack from './slack/addSlackCard.vue'

    const props = defineProps({
        integrationTypeObject: { type: Object, required: true },
    })
</script>

<style scoped></style>
