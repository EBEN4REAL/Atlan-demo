<template>
    <div class="py-6 w-full">
        <h2 class="text-gray-700 text-xl leading-7 ml-6">Top Terms</h2>
        <div
            v-if="termsLoading"
            class="w-full mt-24 items-center min-h-full justify-center"
        >
            <LoadingView />
        </div>
        <div
            v-else-if="termCount && !termsLoading"
            class="max-h-80 overflow-y-scroll flex flex-col text-left"
        >
            <div
                v-for="(term, index) in termsList.slice(0, numberOfTerms)"
                :key="term.guid"
            >
                <TermPreviewCard
                    :class="{
                        'border-b':
                            index !== numberOfTerms - 1 &&
                            index !== termsList.length - 1,
                    }"
                    :term="term"
                />
            </div>
        </div>
        <div class="items-start">
            <a-button type="link">See all {{ termCount }} terms -></a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useHead } from '@vueuse/head'

import TermPreviewCard from '@/glossary/termPreviewCard.vue'
import LoadingView from '@common/loaders/section.vue'

import { Components } from '~/api/atlas/client'
import useGlossaryTerms from '~/composables/glossary/useGlossaryTerms'

interface PropsType {
    terms?: Components.Schemas.AtlasGlossaryTerm[]
    glossaryGuid?: string
    numberOfTerms: number
}

export default defineComponent({
    components: { TermPreviewCard, LoadingView },
    props: ['terms', 'numberOfTerms'],
    setup(props: PropsType) {
        const terms = computed(() => props.terms)
        const glossaryGuid = computed(() => props.glossaryGuid)

        const {
            data: glossaryTerms,
            termsError,
            termsLoading,
            fetchGlossaryTerms,
        } = useGlossaryTerms()

        const numberOfTerms = computed(() => props.numberOfTerms ?? 7)

        const termsList = computed(() => {
            if (glossaryGuid.value) return glossaryTerms?.value
            if (terms.value?.length) return terms?.value
            return []
        })
        const termCount = computed(() => termsList.value?.length)

        onMounted(() => {
            if (glossaryGuid.value) fetchGlossaryTerms(glossaryGuid.value)
        })

        return {
            termsList,
            termCount,
            numberOfTerms,
            termsLoading,
        }
    },
})
</script>