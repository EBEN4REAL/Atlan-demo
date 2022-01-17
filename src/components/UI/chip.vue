<template>
    <span
        class="flex items-end justify-between p-1 rounded group"
        :style="`background: ${background}`"
        :class="class"
    >
        <AtlanIcon v-if="icon" icon="Number" class="h-3 mb-1 text-gray-500" />
        <div class="">{{ content }}</div>
        <AtlanIcon
            icon="Cross"
            class="h-3 mb-1 text-gray-500 opacity-0 cursor-pointer group-hover:opacity-100"
            @click="$emit('remove', id)"
        />
    </span>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'ChipUI',
        props: {
            content: { type: String, required: true },
            class: { type: String, required: true },
            id: { type: [String, Number], required: true },
            icon: { type: String, required: false, default: '' },
            background: { type: String, required: false, default: '#f3f3f3' },
        },
        emits: ['remove'],
        setup() {
            return {}
        },
    })
</script>

<style scoped></style>
