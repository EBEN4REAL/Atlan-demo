import { ref, Ref, computed, watch} from "vue";
import { useAPI } from "~/api/useAPI"

import { GTC_SEARCH } from "~/api/keyMaps/glossary"

import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';

import { Category, Term } from "~/types/glossary/glossary.interface";
import { Components } from '~/api/atlas/client'

export default function useGtcSearch(qualifiedName: Ref<string>) {
    const requestQuery = ref<string>();
    const offsetLocal = ref(0);
    const defaultLimit = 10;
    const limitLocal = ref<number>(defaultLimit);

    const body = ref();

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

    const refreshBody = () => {
        body.value = {
            typeName: "AtlasGlossaryTerm,AtlasGlossaryCategory",
            excludeDeletedEntities: true,
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
                "pageviewCount",
                "anchor",
                ...relatedTerms,
                ...BaseAttributes,
                ...BasicSearchAttributes
            ],
            entityFilters: {
                condition: 'AND',
                criterion: [
                    {
                        attributeName: "qualifiedName",
                        attributeValue: `@${qualifiedName.value ?? ''}`,
                        operator: "endsWith",
                    }
                ]
            },
            // sortBy: "Catalog.popularityScore",
            // sortOrder: "ASCENDING",
            query: requestQuery.value,
            offset: offsetLocal.value,
            limit: limitLocal.value,
        }
    };

    refreshBody();

    const entities: Ref<(Category | Term)[]> = ref<(Category | Term)[]>([]) 

    const { data: assets, error, isValidating: isLoading, mutate } = useAPI<any>(GTC_SEARCH, 'POST', {
        cache: true,
        body,
        dependantFetchingKey: qualifiedName,
        options: {
            revalidateOnFocus: false
        }
    });
    offsetLocal.value += defaultLimit;
    refreshBody();


    watch(qualifiedName, () => {
        limitLocal.value = defaultLimit;
        offsetLocal.value = 0;

        refreshBody()
        
        entities.value = [];
        mutate();

        offsetLocal.value += defaultLimit;
        refreshBody()
    })
    watch(assets, (newAssets) => {
        entities.value = [...entities.value, ...(newAssets.entities ?? [] as (Category | Term)[])]
    } )

    const fetchAssets = (query?: string) => {
        if(query){
            requestQuery.value = query;
            entities.value = [];
        }
        refreshBody();

        mutate();
    }

    const fetchAssetsPaginated = ({limit, offset, refreshSamePage, query}:{limit?: number, offset?: number, refreshSamePage?: Boolean, query?: string}) => {
        if(query || query === ''){ 
            requestQuery.value = query;
            entities.value = [];
        }
        if(offset || offset === 0){ offsetLocal.value = offset;}

        limitLocal.value = limit ?? defaultLimit;
        refreshBody()
        
        if(refreshSamePage){
            mutate();
        } else {
            // console.log('bruh', body.value)
            mutate();
            offsetLocal.value += limit ?? defaultLimit;
            refreshBody()
        }
    }

    return {
        assets,
        entities,
        error,
        isLoading,
        fetchAssets,
        fetchAssetsPaginated
    };
}
