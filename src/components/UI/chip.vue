<template>
    <span
        class="flex items-end justify-between p-1 px-2 rounded-full group"
        :style="`background: ${background}`"
        :class="class"
    >
        <AtlanIcon v-if="icon" icon="Number" class="h-3 mb-1" />
        <div class="">{{ content }}</div>
        <AtlanIcon
            icon="Cross"
            class="h-3 mb-1 ml-0.5 text-gray-500 opacity-0 cursor-pointer group-hover:opacity-100"
            @click="$emit('remove', index)"
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
            index: { type: Number, required: true },
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
