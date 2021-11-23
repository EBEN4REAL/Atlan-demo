<template>
    <span
        class="px-3 py-2 rounded-full group"
        :style="`background: ${background}`"
    >
        <AtlanIcon v-if="icon" icon="Number" class="mb-1 text-gray-500" />
        {{ content }}
        <AtlanIcon
            icon="Cross"
            class="mb-1 text-gray-500 opacity-0 cursor-pointer  group-hover:opacity-100"
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
