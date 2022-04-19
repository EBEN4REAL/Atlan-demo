<template>
    <div>
        <p class="text-gray-500 mb-1">
            {{ $t('common.term.linked-term', 2) }}
        </p>
        <p class="font-bold">{{ linkedTerms }}</p>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'GlossaryPopoverLinkedTerms',
    }
</script>

<script setup lang="ts">
    import { computed, ref, toRefs } from 'vue'

    const props = defineProps({
        attributes: {
            type: Object,
            required: true,
        },
        term: {
            type: Object,
            required: false,
            default: () => {},
        },
    })

    const { attributes } = toRefs(props)

    const linkedTerms = computed(() => attributes?.value?.linkedTermsCount || 0)
</script>

<style scoped></style>
