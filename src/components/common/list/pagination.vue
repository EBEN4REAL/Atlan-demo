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
        {{ currentView }} of
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
        :disabled="upperOffset >= Math.ceil(total)"
        @click="$emit('change', current + 1)"
    >
        <AtlanIcon icon="CaretRight" />
    </AtlanBtn>
</template>

<script setup lang="ts">
    import { computed, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'

    const props = defineProps({
        current: {
            type: Number,
            required: true,
        },
        pageSize: {
            type: Number,
            required: true,
        },
        offset: {
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

    const { current, pageSize, total, offset } = toRefs(props)

    const upperOffset = computed(
        () => (current.value - 1 || 1) * pageSize.value + offset.value
    )
    const currentView = computed(() => {
        const string = `${(current.value - 1) * pageSize.value + 1} - ${
            total.value < upperOffset.value ? total.value : upperOffset.value
        }`

        return string
    })
</script>

<style scoped></style>
