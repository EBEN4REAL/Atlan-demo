<template>
    <div>
        <p class="text-gray-500 mb-1">
            {{ $t('common.term.category', 2) }}
        </p>
        <p class="font-bold">{{ categories }}</p>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'GlossaryPopoverCategoryCount',
    }
</script>

<script setup lang="ts">
    import { computed, toRefs } from 'vue'

    const props = defineProps({
        attributes: {
            type: Object,
            required: true,
        },
        term: {
            type: Object,
            required: false,
            default: {},
        },
    })

    const { attributes, term } = toRefs(props)

    const categories = computed(() => term?.value?.categoryCount || 0)
</script>

<style scoped></style>
