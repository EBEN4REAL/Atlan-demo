<template>
    <a-typography-text
        :style="{ width: '100%', 'max-width': maxWidth }"
        :ellipsis="{
            tooltip: text,
            onEllipsis: () => (ellipsis = !ellipsis),
        }"
        :content="text"
    />
</template>

<script setup lang="ts">
    /** ************************* */
    // ! ~ this component is experimental, USE IT AT YOUR OWN RISK @SAMIRAN
    /** ************************* */

    import { ref } from 'vue'

    const props = defineProps({
        text: { type: String, required: true },
        maxWidth: { type: String, default: '100%' },
    })
    const ellipsis = ref(false)
</script>

<style scoped></style>
