import { ref, Ref, ComputedRef, computed, watch } from 'vue'

import useIndexSearch from '~/composables/discovery/useIndexSearch'

import { InternalAttributes, AssetAttributes } from '~/constant/projection'
// import useBusinessMetadataStore from '~/store/businessMetadata'

import { Category, Glossary, Term } from '~/types/glossary/glossary.interface'

interface parameters {
    qualifiedName?: ComputedRef<string>,
    dependantFetchingKey?: Ref<any>,
    type?: 'AtlasGlossaryCategory' | 'AtlasGlossaryTerm' | string[],
    limit?: number,
    additionalFilters?: Array<Record<string, any>>
}
export default function useGtcSearch({
    qualifiedName,
    dependantFetchingKey,
    type,
    limit,
    additionalFilters,
}: parameters) {
    const requestQuery = ref<string>('')
    const offsetLocal = ref(0)
    const defaultLimit = limit || 20
    const limitLocal = ref<number>(defaultLimit)
    const localFilters = ref()

    const body = ref()

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
    ]

    // const bmProjection = computed(
    //     () => useBusinessMetadataStore().getBusinessMetadataListProjections
    // )

    const refreshBody = () => {
        const filter: Array<Record<string, any>> =  [
            {
                terms: {
                    "__typeName.keyword": [
                        "AtlasGlossaryTerm",
                        "AtlasGlossaryCategory",
                        "AtlasGlossary"
                    ]
                }
            }
        ];
        if(qualifiedName?.value) {
            filter.push({
                wildcard: {
                    qualifiedName: `*${qualifiedName?.value ?? '' }`
                }
            })
        }
        if(requestQuery.value.length && requestQuery.value !== '' ) {
            filter.push({
                wildcard: {
                    "name": `*${requestQuery.value}*`   
                }
            })
        }
        body.value = {
            dsl: {
                size: limitLocal.value,
                from: offsetLocal.value,
                query: {
                    bool: {
                        filter
                    }
                },
                aggs: {
                    group_by_typename: {
                        terms: {
                            field: "__typeName.keyword",
                        }
                    }
                }
            },
            relationAttributes: [
                'readme',
                'displayText',
                'name',
                'description',
                'shortDescription',
            ],

            attributes: [
                // ...projection,
                'database',
                'atlanSchema',
                'metadata',
                'certificateStatus',
                'shortDescription',
                'parentCategory',
                'categories',
                'terms',
                'childrenCategories',
                'pageviewCount',
                'anchor',
                'ownerUsers',
                'ownerGroups',
                'readme',
                'assignedEntities',
                // ...bmProjection.value,
                ...relatedTerms,
                ...InternalAttributes,
                ...AssetAttributes,
            ],
        }
        let typeName: string[] =  [];

        if (qualifiedName && qualifiedName.value) {
            if (type === 'AtlasGlossaryCategory')
                typeName = ['AtlasGlossaryCategory']
            else if (type === 'AtlasGlossaryTerm')
                typeName = ['AtlasGlossaryTerm']
            else typeName = ['AtlasGlossaryTerm', 'AtlasGlossaryCategory']

        } else {
            if(Array.isArray(type)) {
                typeName = [...type]
            }
            else if (type && type !== '') {
                typeName = [type]
            }  
            else
                typeName =
                    ['AtlasGlossaryTerm', 'AtlasGlossaryCategory', 'AtlasGlossary']
        }
        body.value.dsl.query.bool.filter[0].terms['__typeName.keyword'] = typeName
    }

    refreshBody()

    const entities: Ref<(Category | Term | Glossary)[]> = ref<(Category | Term)[]>([])
    const terms = computed(() =>
        entities.value.filter(
            (entity) => entity.typeName === 'AtlasGlossaryTerm'
        )
    )
    const categories = computed(() =>
        entities.value.filter(
            (entity) => entity.typeName === 'AtlasGlossaryCategory'
        )
    ) as ComputedRef<Category[]>
    const glossaries = computed(() =>
        entities.value.filter((entity) => entity.typeName === 'AtlasGlossary')
    )
    // const referredEntities =
    //     ref<Record<string, Components.Schemas.AtlasEntityHeader>>()

    const {
        data: assets,
        error,
        isLoading,
        mutate,
    } = useIndexSearch<Category | Glossary | Term>(body, dependantFetchingKey, false)
   
    const approximateCount = computed(() => assets.value?.approximateCount)

    offsetLocal.value += defaultLimit
    refreshBody()

    watch(qualifiedName, () => {
        if (
            (dependantFetchingKey && dependantFetchingKey?.value) ||
            !dependantFetchingKey
        ) {
            limitLocal.value = defaultLimit
            offsetLocal.value = 0

            refreshBody()

            entities.value = []
            mutate()

            offsetLocal.value += defaultLimit
            refreshBody()
        }
    })
    watch(assets, (newAssets) => {
        entities.value = [
            ...entities.value,
            ...(newAssets?.entities ?? ([] as (Category | Term)[])),
        ]
        // referredEntities.value = newAssets.referredEntities
    })

    const fetchAssets = (query?: string) => {
        if (query) {
            requestQuery.value = query
        }

        entities.value = []
        refreshBody()

        mutate()
    }

    const deleteEntityFromList = (guid: String) => {
        entities.value = entities.value.filter((el) => el.guid !== guid)
    }

    const fetchAssetsPaginated = ({
        limit,
        offset,
        refreshSamePage,
        query,
        filters,
    }: {
        limit?: number
        offset?: number
        refreshSamePage?: Boolean
        query?: string
        filters?: Record<string, any>
    }) => {
        if (query || query === '') {
            requestQuery.value = query
            entities.value = []
        }
        if (offset || offset === 0) {
            offsetLocal.value = offset
        }

        if (filters) {
            entities.value = []
            localFilters.value = {
                condition: 'OR',
                criterion: filters,
            }
        }
        limitLocal.value = limit ?? defaultLimit
        refreshBody()

        if (refreshSamePage) {
            mutate()
        } else {
            mutate()
            offsetLocal.value += limit ?? defaultLimit
            refreshBody()
        }
    }

    return {
        assets,
        entities,
        terms,
        categories,
        glossaries,
        error,
        isLoading,
        approximateCount,
        fetchAssets,
        fetchAssetsPaginated,
        deleteEntityFromList,
    }
}
