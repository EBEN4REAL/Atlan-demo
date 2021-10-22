import { ref, Ref, ComputedRef, computed, watch } from 'vue'
import { useAPI } from '~/services/api/useAPI'

import { GTC_SEARCH } from '~/api/keyMaps/glossary'

import { projection } from '~/api/atlas/utils'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'
import useBusinessMetadataStore from '~/store/businessMetadata'

import { Category, Glossary, Term } from '~/types/glossary/glossary.interface'
import { Components } from '~/api/atlas/client'
type Filters = {
    condition: string
    criterion: {
        condition: string
        critetion: {
            attributeName: string
            attributeValue: string
            operator: string
        }
    }[]
}
export default function useGtcSearch(
    qualifiedName?: ComputedRef<string>,
    dependantFetchingKey?: Ref<any>,
    type?: 'AtlasGlossaryCategory' | 'AtlasGlossaryTerm' | string[],
    limit?: number
) {
    const requestQuery = ref<string>('')
    const offsetLocal = ref(0)
    const defaultLimit = limit || 20
    const limitLocal = ref<number>(defaultLimit)
    const localFilters = ref<Filters>()

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

    const bmProjection = computed(
        () => useBusinessMetadataStore().getBusinessMetadataListProjections
    )

    const refreshBody = () => {
        body.value = {
                
            dsl: {
                size: limitLocal.value,
                from: offsetLocal.value,
                query: {
                    bool: {
                        filter: [
                            {
                                terms: {
                                    "__typeName.keyword": [
                                        "AtlasGlossaryTerm",
                                        "AtlasGlossaryCategory",
                                        "AtlasGlossary"
                                    ]
                                }
                            },
                            {
                                wildcard: {
                                    qualifiedName: `*${qualifiedName?.value ?? '' }`
                                }
                            },
                            {
                                wildcard: {
                                    "Asset.name": `*${requestQuery.value}*`   
                                }
                            }
                        ]
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
                ...projection,
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
                ...bmProjection.value,
                ...relatedTerms,
                ...BaseAttributes,
                ...BasicSearchAttributes,
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
            if (type && type !== '') {
                typeName = [type]
            }  else if(Array.isArray(type)) {
                typeName = type
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
    const referredEntities =
        ref<Record<string, Components.Schemas.AtlasEntityHeader>>()

    const {
        data: assets,
        error,
        isLoading,
        mutate,
    } = useAPI<any>(GTC_SEARCH, 'POST', {
        cache: false,
        body,
        options: {
            immediate:
                dependantFetchingKey && dependantFetchingKey.value
                    ? true
                    : qualifiedName?.value
                    ? true
                    : false,
            revalidateOnFocus: false,
        },
    })
    const approximateCount = computed(() => assets.value.approximateCount)

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
            ...(newAssets.entities ?? ([] as (Category | Term)[])),
        ]
        referredEntities.value = newAssets.referredEntities
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
        filters?: Filters
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
        referredEntities,
        approximateCount,
        fetchAssets,
        fetchAssetsPaginated,
        deleteEntityFromList,
    }
}
