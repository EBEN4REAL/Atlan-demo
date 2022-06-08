<template>
    <div class="flex items-center" :class="{ 'animate-pulse': loading }">
        <IconButton
            class="rounded-tr-none rounded-br-none"
            icon="CaretLeft"
            :disabled="current === 1"
            @click="handlePagination(-1)"
        />
        <span class="px-1.5 py-1 border-t border-b"
            >{{ current }} of {{ totalPages || '_' }}</span
        >
        <IconButton
            class="rounded-tl-none rounded-bl-none"
            icon="CaretRight"
            :disabled="current >= Math.ceil(totalPages)"
            @click="handlePagination(1)"
        />
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, defineComponent, toRefs } from 'vue'

    export default defineComponent({
        name: 'PaginationNew',
        props: {
            offset: {
                type: Number,
                required: true,
            },
            total: {
                type: Number,
                required: true,
            },
            limit: {
                type: Number,
                required: true,
            },
            loading: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['update:offset'],
        setup(props, { emit }) {
            const { offset } = useVModels(props, emit)
            const { limit, total } = toRefs(props)

            const current = computed(() => offset.value / limit.value + 1)
            const totalPages = computed(() =>
                Math.ceil(total.value / limit.value)
            )

            const handlePagination = (navigateTo: number) => {
                const num = offset.value + navigateTo * limit.value
                if (num >= 0 && num < total.value)
                    offset.value += navigateTo * limit.value
            }

            return { current, handlePagination, totalPages }
        },
    })
</script>

<style scoped></style>
