<template>
    <div
        class="grid grid-cols-1 px-4 gap-y-4"
        :class="{
            'py-3': (isTerm && !isTermEmpty) || !isTerm,
        }"
        style="min-width: 374px"
    >
        <GlossaryPopoverDescription
            v-if="attributes?.localDescription"
            :attributes="attributes"
        />
        <div v-if="isGlossary" class="flex">
            <div class="mr-12">
                <p class="text-gray-500 mb-1">Terms</p>
                <p class="font-bold">{{ term?.termsCount || 0 }}</p>
            </div>
            <div>
                <p class="text-gray-500 mb-1">Categories</p>
                <p class="font-bold">{{ term?.categoryCount || 0 }}</p>
            </div>
        </div>
        <GlossaryPopoverCategories
            v-if="isTerm && attributes?.localCategories?.length > 0"
            :attributes="attributes"
        />
        <GlossaryPopoverOwners
            v-if="
                !isCategory &&
                (attributes?.localOwners?.ownerGroups?.length ||
                    attributes?.localOwners?.ownerUsers?.length)
            "
            :attributes="attributes"
        />
        <GlossaryPopoverRelatedTerms
            v-if="isTerm && attributes?.localSeeAlso?.length"
            :attributes="attributes"
        />
        <div v-if="isCategory" class="flex">
            <div class="mr-12">
                <GlossaryPopoverLinkedTerms
                    :attributes="attributes"
                    :term="term"
                />
            </div>
            <div>
                <GlossaryPopoverOwners
                    v-if="
                        attributes?.localOwners?.ownerGroups?.length ||
                        attributes?.localOwners?.ownerUsers?.length
                    "
                    :attributes="attributes"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import GlossaryPopoverDescription from './common/description.vue'
    import GlossaryPopoverCategories from './common/categories.vue'
    import GlossaryPopoverOwners from './common/owners.vue'
    import GlossaryPopoverRelatedTerms from './common/relatedTerms.vue'
    import GlossaryPopoverLinkedTerms from './common/linkedTerms.vue'

    export default {
        name: 'GlossaryPopoverBody',
        components: {
            GlossaryPopoverDescription,
            GlossaryPopoverCategories,
            GlossaryPopoverOwners,
            GlossaryPopoverRelatedTerms,
            GlossaryPopoverLinkedTerms,
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
        term: {
            type: Object,
            required: false,
            default: {},
        },
    })

    const { attributes, term } = toRefs(props)
    const isTermEmpty = computed(
        () =>
            !(
                attributes?.value?.localDescription?.length > 0 ||
                attributes?.value?.localCategories?.length > 0 ||
                attributes?.value?.localSeeAlso?.length > 0 ||
                attributes?.value?.localOwners?.ownerGroups?.length > 0 ||
                attributes?.value?.localOwners?.ownerUsers?.length > 0
            )
    )
    const isTerm = computed(() => term?.value?.typeName === 'AtlasGlossaryTerm')
    const isCategory = computed(
        () => term?.value?.typeName === 'AtlasGlossaryCategory'
    )
    const isGlossary = computed(() => term?.value?.typeName === 'AtlasGlossary')
</script>

<style scoped></style>
