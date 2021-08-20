import { watch, ref, Ref,computed } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GTC_ENTITY } from "~/api/keyMaps/glossary"
import { Glossary, Category, Term } from "~/types/glossary/glossary.interface";


import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';

/*
 * Uses the Atlas API to fetch a Glossary / Category / Term depending on 
 * the type
 */
const useGTCEntity = <T extends Glossary | Category | Term>(type: 'glossary' | 'category' | 'term', entityGuid:Ref<string>, cache?: string) => {
    const keyMap = {
        glossary: 'AtlasGlossary',
        category: 'AtlasGlossaryCategory',
        term: 'AtlasGlossaryTerm',
    }

    const guidLocal = ref<string>()
    const body = ref({});

    const relatedTerms = [
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
    ];

    const getBody = () => ({
        typeName: keyMap[type],
        excludeDeletedEntities: false,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        attributes: [
            ...projection,
            "assignedEntities",
            "atlanSchema",
            "metadata",
            "assetStatus",
            "shortDescription",
            "parentCategory",
            "categories",
            "terms",
            "tenantId",
            "anchor",
            "linkedAssets",
            ...relatedTerms,
            ...BaseAttributes,
            ...BasicSearchAttributes
        ],
        entityFilters: {
            condition: 'AND',
            criterion: [
                {
                    attributeName: "__guid",
                    attributeValue: entityGuid.value,
                    operator: "eq",
                }
            ]
        }
    });

    body.value = getBody();
    const { data, error, isValidating: isLoading, mutate } = useAPI<any>(GET_GTC_ENTITY, 'POST', {
        cache: cache ?? true,
        dependantFetchingKey: entityGuid,
        body,
        options: {
            revalidateOnFocus: false
        }
    })

    const entity = computed(() => data.value?.entities ? data.value?.entities[0] as T : undefined)

    watch(entityGuid, () => {
        body.value = getBody()
        mutate()
    });

    const refetch = () => {
        body.value = getBody()
        mutate()
    }

    return { entity, error, isLoading, refetch }
}

export default useGTCEntity;