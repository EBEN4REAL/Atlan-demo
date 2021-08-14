import { watch, ref, Ref } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GTC_ENTITY } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";


import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';
/**
 * Uses the Atlas API to fetch a Glossary / Category / Term depending on 
 * the type
 */
const useGTCEntity = (type: 'glossary' | 'category' | 'term', entityGuid:Ref<string>) => {
    const keyMap = {
        glossary: 'AtlasGlossary',
        category: 'AtlasGlossaryCategory',
        term: 'AtlasGlossaryTerm',
    }

    const body = ref({});

    const getBody = () => ({
        typeName: keyMap[type],
        excludeDeletedEntities: false,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        attributes: [
            ...projection,
            "database",
            "atlanSchema",
            "metadata",
            "assetStatus",
            "shortDescription",
            "parentCategory",
            "categories",
            "terms",
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
    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossary>(GET_GTC_ENTITY, 'POST', {
        cache: true,
        dependantFetchingKey: entityGuid,
        body,
        options: {
            revalidateOnFocus: false
        }
    })

    watch(entityGuid, () => {
        body.value = getBody()
        mutate()
    })

    return { data, error, isLoading }
}

export default useGTCEntity;