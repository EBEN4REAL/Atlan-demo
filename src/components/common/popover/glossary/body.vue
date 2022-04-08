<template>
    <div class="w-full px-4 py-3" style="min-width: 374px">
        <GlossaryPopoverDescription
            v-if="attributes?.localDescription"
            :attributes="attributes"
            class="mb-4"
        />
        <GlossaryPopoverCategories
            v-if="attributes?.localCategories.length > 0"
            :attributes="attributes"
            class="mb-4"
        />
        <GlossaryPopoverOwners
            v-if="
                attributes?.localOwners?.ownerGroups?.length ||
                attributes?.localOwners?.ownerUsers?.length
            "
            :attributes="attributes"
            class="mb-4"
        />
        <GlossaryPopoverRelatedTerms
            v-if="attributes?.localSeeAlso?.length"
            :attributes="attributes"
            class="mb-4"
        />
    </div>
</template>

<script lang="ts">
    import GlossaryPopoverDescription from './common/description.vue'
    import GlossaryPopoverCategories from './common/categories.vue'
    import GlossaryPopoverOwners from './common/owners.vue'
    import GlossaryPopoverRelatedTerms from './common/relatedTerms.vue'

    export default {
        name: 'GlossaryPopoverBody',
        components: {
            GlossaryPopoverDescription,
            GlossaryPopoverCategories,
            GlossaryPopoverOwners,
            GlossaryPopoverRelatedTerms,
        },
    }
</script>

<script setup lang="ts">
    import { computed, PropType, ref, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { Category, Term } from '~/types/glossary/glossary.interface'

    const props = defineProps({
        attributes: {
            type: Object,
            required: true,
        },
    })

    const { attributes } = toRefs(props)
</script>

<style scoped></style>
