import { ref, Ref, computed, watch} from "vue";
import { useAPI } from "~/api/useAPI"

import { GTC_SEARCH } from "~/api/keyMaps/glossary"

import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';

import { Category, Term } from "~/types/glossary/glossary.interface";
import { Components } from '~/api/atlas/client'
type Filters  = {
    condition: string;
    criterion: {
        condition: string;
        critetion: {
            attributeName: string;
            attributeValue: string;
            operator: string;
        }
    }[]
}
export default function useGtcSearch(qualifiedName: Ref<string>) {
    const requestQuery = ref<string>();
    const offsetLocal = ref(0);
    const defaultLimit = 10;
    const limitLocal = ref<number>(defaultLimit);
    const localFilters = ref<Filters>()

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
                "ownerUsers",
                "ownerGroups",
                ...relatedTerms,
                ...BaseAttributes,
                ...BasicSearchAttributes
            ],
            entityFilters: {
                condition: 'AND',
                criterion: [
                    {
                        condition: 'OR',
                        criterion: [{
                            attributeName: "qualifiedName",
                            attributeValue: `@${qualifiedName.value ?? ''}`,
                            operator: "endsWith",
                        }]
                    },
                    ...(localFilters.value?.criterion ?? [])
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


    const fetchAssetsPaginated = ({limit, offset, refreshSamePage, query, filters}:{limit?: number, offset?: number, refreshSamePage?: Boolean, query?: string, filters?: Filters }) => {
        if(query || query === ''){ 
            requestQuery.value = query;
            entities.value = [];
        }
        if(offset || offset === 0){ offsetLocal.value = offset;}
        
        if(filters?.criterion.length){
            entities.value = [];
            localFilters.value = filters;
        }

        limitLocal.value = limit ?? defaultLimit;
        refreshBody()
        
        if(refreshSamePage){
            mutate();
        } else {
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
