import { watch, ref, Ref,computed, isRef, WritableComputedRef } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GTC_ENTITY } from "~/api/keyMaps/glossary"
import { Glossary, Category, Term } from "~/types/glossary/glossary.interface";


import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';
import { List as StatusList } from '~/constant/status'

/*
 * Uses the Atlas API to fetch a Glossary / Category / Term depending on 
 * the type
 */
const useGTCEntity = <T extends Glossary | Category | Term>(type: 'glossary' | 'category' | 'term' | Ref<'glossary' | 'category' | 'term'>, entityGuid:Ref<string>, cache?: boolean) => {
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
        typeName: keyMap[isRef(type) ? type.value : type],
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
    const { data, error, isLoading, mutate } = useAPI<any>(GET_GTC_ENTITY, 'POST', {
        cache: cache ?? true,
        dependantFetchingKey: entityGuid,
        body,
        options: {
            revalidateOnFocus: false
        }
    })

    const entity = computed(() => data.value?.entities ? data.value?.entities[0] as T : undefined);
    const title: WritableComputedRef<string | undefined> = computed({
        get: () => entity.value?.attributes?.name ?? '',
        set: (val: string) => {
            if(entity.value)
                entity.value.attributes.name = val;
        }
    });
    const shortDescription = computed(
        () => entity.value?.attributes?.shortDescription
    );
    const qualifiedName = computed(
        () => entity.value?.attributes?.qualifiedName ?? ''
    );
    const statusObject = computed(() =>
        StatusList.find(
            (status) =>
                status.id === entity.value?.attributes?.assetStatus
        )
    );

    watch(entityGuid, (newGuid) => {
        body.value = getBody()
        mutate()
    });

    const refetch = () => {
        body.value = getBody()
        mutate()
    }

    return { entity, title, shortDescription, qualifiedName, statusObject, error, isLoading, refetch, mutate }
}

export default useGTCEntity;