import { ref } from "vue";
import { useAPI } from "~/api/useAPI"

import { GET_TERM_LINKED_ASSETS } from "~/api/keyMaps/glossary"

import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';

import { Components } from '~/api/atlas/client'

export default function useGtcSearch() {
    const qualifiedName = ref<string>();
    const requestQuery = ref<string>();

    const entityFilters = {
        condition: 'AND',
        criterion: [
            {
                attributeName: "qualifiedName",
                attributeValue: `@${qualifiedName ?? ''}`,
                operator: "endsWith",
            }
        ]
    }

    const body = ref({
        typeName: "AtlasGlossaryTerm,AtlasGlossaryCategory",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        attributes: [
            ...projection,
            //   ...BUSINESS_METADATA_GET_ATTRIBUTE_PROJECTION,
            //   ...CUSTOM_RELATIONSHIP_ATTRIBUTES_TABLE,
            //   ...CUSTOM_RELATIONSHIP_ATTRIBUTES_COLUMN,
            "files",
            "table",
            "database",
            "atlanSchema",
            "profileSchedule",
            "isProfileScheduled",
            "order",
            "extra",
            "metadata",
            "commits",
            "assetStatus",
            ...BaseAttributes,
            ...BasicSearchAttributes
        ],
        entityFilters,
        query: requestQuery
    });

    const { data: assets, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasSearchResult>(GET_TERM_LINKED_ASSETS, 'POST', {
        cache: true,
        body,
        dependantFetchingKey: qualifiedName,
        options: {
            revalidateOnFocus: false
        }
    })

    const fetchAssets = (name: string, query?:string) => {
        body.value.entityFilters.criterion[0].attributeValue = `@${name}`;
        qualifiedName.value = name;

        body.value.query =  query ?? '';
        requestQuery.value = query ?? '';


        if (name || query)
            mutate();
    }

    return {
        assets,
        error,
        isLoading,
        fetchAssets,
    };
}
