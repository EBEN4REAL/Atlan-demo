<template>
    <div v-if="availableRelatedTerms?.length" class="w-full">

        <div class="flex flex-col text-left">
            <div v-for="related in availableRelatedTerms" :key="related">
                <h3 class="text-md leading-6">
                    {{ relatedTermDisplayNameMap[related] }}
                </h3>
                <div  class="flex flex-row justify-start m-0 p-0">
                    <div
                        v-for="relatedTerm in entity.attributes[related]"
                        :key="relatedTerm?.guid"
                        class="bg-blue-50 text-blue-700 px-2 mr-2 mb-4 leading-6"
                    >
                        {{ relatedTerm?.uniqueAttributes?.qualifiedName?.split('@')[0] }}
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
import { defineComponent, computed,PropType, onMounted, watch, ref } from 'vue'

import { Term } from '~/types/glossary/glossary.interface'
import { Components } from '~/api/atlas/client'



export default defineComponent({
    components: {},
    props: {
                entity: {
            type: Object as PropType<Term>,
            required: true,
            default: () => ({}),
        },
    },
    setup(props) {
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
            return Object.keys(props.entity.attributes).filter((key) =>
                list.find((item) => item === key) 
            ) ?? []
        })

        return {
            availableRelatedTerms,
            relatedTermDisplayNameMap,
        }
    },
})
</script>