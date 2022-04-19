<template>
    <div>
        <p class="text-gray-500 mb-1">{{ $t('common.term.description') }}</p>
        <a-typography-paragraph
            class="text-gray-700"
            :content="description"
            :ellipsis="{ rows: 3, tooltip: false }"
        />
    </div>
</template>

<script lang="ts">
    export default {
        name: 'GlossaryPopoverDescription',
    }
</script>

<script setup lang="ts">
    import { computed, toRefs } from 'vue'

    const props = defineProps({
        attributes: {
            type: Object,
            required: true,
        },
    })

    const { attributes } = toRefs(props)

    const description = computed(() => attributes?.value?.localDescription)
</script>

<style scoped></style>
