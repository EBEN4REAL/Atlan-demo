<template>
    <AtlanBtn
        class="bg-transparent rounded-r-none"
        size="sm"
        color="secondary"
        padding="compact"
        :disabled="current === 1"
        @click="$emit('change', current - 1)"
    >
        <AtlanIcon icon="CaretLeft" />
    </AtlanBtn>
    <AtlanBtn
        class="bg-transparent border-l-0 border-r-0 rounded-none cursor-default"
        size="sm"
        color="secondary"
        padding="compact"
    >
        {{ current }} of
        <span v-if="Math.ceil(total)">{{ Math.ceil(total) }}</span>

        <div v-else-if="loading" class="flex items-center justify-center">
            <AtlanIcon icon="CircleLoader" class="animate-spin" />
        </div>
    </AtlanBtn>

    <AtlanBtn
        class="bg-transparent rounded-l-none"
        size="sm"
        color="secondary"
        padding="compact"
        :disabled="current === Math.ceil(total)"
        @click="$emit('change', current + 1)"
    >
        <AtlanIcon icon="CaretRight" />
    </AtlanBtn>
</template>

<script setup lang="ts">
    import AtlanBtn from '@/UI/button.vue'

    const props = defineProps({
        current: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
    })
    const emit = defineEmits(['handlePagination', 'change'])
</script>

<style scoped></style>
