<template>
    <div
        v-if="text && text.length > threshold"
        class="relative overflow-hidden text-gray-500 break-words"
        :class="trimmed ? 'h-5 flex gap-x-2' : ''"
    >
        <div class="flex-1" :class="trimmed ? 'break-all' : ''">
            {{ text }}
        </div>
        <span
            class="right-0 break-normal rounded cursor-pointer text-primary hover:underline"
            @click="
                (e) => {
                    e.stopPropagation()
                    trimmed = !trimmed
                }
            "
        >
            {{ trimmed ? 'show more' : 'show less' }}
        </span>
    </div>
    <div v-else class="text-gray-500">
        {{ text }}
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'

    const props = defineProps({
        text: { type: String, required: true },
        threshold: { type: Number, required: false, default: 80 },
    })

    const trimmed = ref(true)
</script>

<style scoped></style>
