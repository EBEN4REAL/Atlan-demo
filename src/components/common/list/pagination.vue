<template>
    <AtlanBtn
        class="bg-transparent rounded-r-none"
        size="sm"
        color="secondary"
        padding="compact"
        :disabled="current === 1"
        @click="handlePagination(current - 1)"
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
        <span v-if="Math.ceil(totalPages)">{{ Math.ceil(totalPages) }}</span>

        <div v-else-if="loading" class="flex items-center justify-center">
            <AtlanIcon icon="CircleLoader" class="animate-spin" />
        </div>
    </AtlanBtn>

    <AtlanBtn
        class="bg-transparent rounded-l-none"
        size="sm"
        color="secondary"
        padding="compact"
        :disabled="current >= Math.ceil(totalPages)"
        @click="handlePagination(current + 1)"
    >
        <AtlanIcon icon="CaretRight" />
    </AtlanBtn>
</template>

<script setup lang="ts">
    import { computed, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import { useVModels } from '@vueuse/core'

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
        totalPages: {
            type: Number,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
    })
    const emit = defineEmits(['mutate'])
    const { current, offset } = useVModels(props, emit)
    const { pageSize } = toRefs(props)

    // const upperOffset = computed(
    //     () => (current.value - 1 || 1) * pageSize.value + offset.value
    // )
    // const currentView = computed(() => {
    //     const string = `${(current.value - 1) * pageSize.value + 1} - ${
    //         totalPages.value < upperOffset.value
    //             ? totalPages.value
    //             : upperOffset.value
    //     }`

    //     return string
    // })

    const handlePagination = (navigateTo: number) => {
        current.value = navigateTo
        offset.value = pageSize.value * (navigateTo - 1)
        emit('mutate')
    }
</script>

<style scoped></style>
