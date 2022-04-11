<template>
    <div>
        <p class="text-gray-500 mb-1">
            {{ $t('common.term.related-term', 2) }}
        </p>
        <div class="flex flex-wrap gap-1">
            <TermPill
                v-for="(term, index) in relatedTerms.slice(0, 2)"
                :key="index"
                :term="term"
                :allow-delete="false"
            />
            <div
                v-if="relatedTerms.length > 2"
                class="rounded-full bg-gray-100 flex justify-center align-center items-center px-1.5 py-1 border border-gray-200 text-gray-700"
            >
                +{{ relatedTerms.length - 2 }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import TermPill from '@/common/pills/term.vue'
    import BasePill from '@/common/pills/base.vue'

    export default {
        name: 'GlossaryPopoverRelatedTerms',
        components: {
            TermPill,
            BasePill,
        },
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

    const relatedTerms = computed(() => attributes?.value?.localSeeAlso)
</script>

<style scoped></style>
