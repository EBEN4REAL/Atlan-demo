<template>
    <a-typography-text
        :style="{ width: 'auto', 'max-width': maxWidth }"
        :ellipsis="{
            tooltip: text,
            onEllipsis: () => (ellipsis = !ellipsis),
        }"
        :content="text"
    />
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps({
        text: { type: String, required: true },
        maxWidth: { type: String, default: '100%' },
    })
    const ellipsis = ref(false)
</script>

<style scoped></style>
