<template>
    <div class="py-6 w-full">
        <h2 class="text-gray-700 text-xl leading-7 ml-6">Related Terms</h2>

        <div class="max-h-80 pl-6 overflow-y-scroll flex flex-col text-left">
            <div v-for="related in availableRelatedTerms" :key="related">
                <h3 class="text-md leading-6">
                    {{ relatedTermDisplayNameMap[related] }}
                </h3>
                <div class="flex flex-row justify-start m-0 p-0">
                    <div
                        v-for="relatedTerm in currentTerm[related]"
                        :key="relatedTerm?.guid"
                        class="bg-blue-50 text-blue-700 px-2 mr-2 mb-4 leading-6"
                    >
                        {{ relatedTerm.displayText }}
                    </div>
                    <div class="bg-blue-50 text-blue-700 px-2 mr-2 mb-4">
                        +
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, watch, ref } from 'vue'

import { Components } from '~/api/atlas/client'

interface PropsType {
    term: Components.Schemas.AtlasGlossaryTerm
}

export default defineComponent({
    components: {},
    props: ['term'],
    setup(props: PropsType) {
        const currentTerm = computed(() => props.term)
        const list = [
            'synonyms',
            'antonyms',
            'preferredTerms',
            'preferredToTerms',
            'replacementTerms',
            'replacedBy',
            'translationTerms',
            'translatedTerms',
            'isA',
            'classifies',
            'validValues',
            'validValuesFor',
            'seeAlso',
        ]

        const relatedTermDisplayNameMap = {
            seeAlso: 'See Also',
            synonyms: 'Synonyms',
            antonyms: 'Antonyms',
            preferredTerms: 'Preferred Terms',
            preferredToTerms: 'Preferred To Terms',
            replacementTerms: 'Replacement Terms',
            replacedBy: 'Replaced By',
            translationTerms: 'Translation Terms',
            translatedTerms: 'Translated Terms',
            isA: 'Is a:',
            classifies: 'Classifies',
            validValues: 'Valid Values',
            validValuesFor: 'Valid Values For',
        }

        const availableRelatedTerms = computed(() => {
            return Object.keys(currentTerm.value).filter((key) =>
                list.find((item) => item === key)
            )
        })

        return {
            currentTerm,
            availableRelatedTerms,
            relatedTermDisplayNameMap,
        }
    },
})
</script>