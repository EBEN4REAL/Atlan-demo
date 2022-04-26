<template>
    <div>
        <p class="text-gray-500 mb-1">{{ $t('common.term.category', 2) }}</p>
        <div class="flex flex-wrap gap-1">
            <BasePill
                v-for="(category, index) in categories.slice(0, 2)"
                :key="index"
                :icon="icon(category)"
                :text="category?.attributes?.name"
            />
            <BasePill
                v-if="categories.length > 2"
                :text="`+${categories.length - 2}`"
            />
        </div>
    </div>
</template>

<script lang="ts">
    export default {
        name: 'GlossaryPopoverCategories',
    }
</script>

<script setup lang="ts">
    import { computed, toRefs } from 'vue'
    import BasePill from '@common/pills/base.vue'

    const props = defineProps({
        attributes: {
            type: Object,
            required: true,
        },
    })

    const { attributes } = toRefs(props)

    const categories = computed(() => attributes?.value?.localCategories)

    const icon = (category) => {
        if (
            category?.attributes?.certificateStatus?.toLowerCase() ===
            'verified'
        ) {
            return 'CategoryVerified'
        }
        if (
            category?.attributes?.certificateStatus?.toLowerCase() === 'draft'
        ) {
            return 'CategoryDraft'
        }
        if (
            category?.attributes?.certificateStatus?.toLowerCase() ===
            'deprecated'
        ) {
            return 'CategoryDeprecated'
        }
        return 'Category'
    }
</script>

<style scoped></style>
