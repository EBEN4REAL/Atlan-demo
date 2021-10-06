import { ref, Ref, ComputedRef, computed, watch } from 'vue'
import { useAPI } from '~/api/useAPI'

import { GTC_SEARCH } from '~/api/keyMaps/glossary'

import { projection } from '~/api/atlas/utils'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'
import { useBusinessMetadataStore } from '~/store/businessMetadata';

import { Category, Term } from '~/types/glossary/glossary.interface'
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
    type?: 'AtlasGlossaryCategory' | 'AtlasGlossaryTerm'
) {
    const requestQuery = ref<string>()
    const offsetLocal = ref(0)
    const defaultLimit = 50
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

    const bmProjection = computed(() => useBusinessMetadataStore().getBusinessMetadataListProjections);

    const refreshBody = () => {
        body.value = {
            // typeName: 'AtlasGlossaryTerm,AtlasGlossaryCategory',
            excludeDeletedEntities: true,
            includeClassificationAttributes: true,
            includeSubClassifications: true,
            includeSubTypes: true,
            attributes: [
                ...projection,
                'database',
                'atlanSchema',
                'metadata',
                'assetStatus',
                'shortDescription',
                'parentCategory',
                'categories',
                'childrenCategories',
                'pageviewCount',
                'anchor',
                'ownerUsers',
                'ownerGroups',
                'assignedEntities',
                ...bmProjection.value,
                ...relatedTerms,
                ...BaseAttributes,
                ...BasicSearchAttributes,
            ],
            // entityFilters: {
            //     condition: 'AND',
            //     criterion: [
            //         {
            //             condition: 'OR',
            //             criterion: [
            //                 {
            //                     attributeName: 'qualifiedName',
            //                     attributeValue: `@${qualifiedName.value ?? ''}`,
            //                     operator: 'endsWith',
            //                 },
            //             ],
            //         },
            //         ...(localFilters.value?.criterion ?? []),
            //     ],
            // },
            // sortBy: "Catalog.popularityScore",
            // sortOrder: "ASCENDING",
            query: requestQuery.value,
            offset: offsetLocal.value,
            limit: limitLocal.value,
        }

        if (qualifiedName && qualifiedName.value) {
            if (type === 'AtlasGlossaryCategory')
                body.value.typeName = 'AtlasGlossaryCategory'
            else if (type === 'AtlasGlossaryTerm')
                body.value.typeName = 'AtlasGlossaryTerm'
            else body.value.typeName = 'AtlasGlossaryTerm,AtlasGlossaryCategory'
            body.value.entityFilters = {
                condition: 'AND',
                criterion: [
                    {
                        condition: 'OR',
                        criterion: [
                            {
                                attributeName: 'qualifiedName',
                                attributeValue: `@${qualifiedName.value ?? ''}`,
                                operator: 'endsWith',
                            },
                        ],
                    },
                    ...(localFilters.value?.criterion ?? []),
                ],
            }
        } else {
            if (type && type != '') {
                body.value.typeName = `${type}`
            } else
                body.value.typeName =
                    'AtlasGlossaryTerm,AtlasGlossaryCategory,AtlasGlossary'
            body.value.entityFilters = {
                condition: 'AND',
                criterion: [...(localFilters.value?.criterion ?? [])],
            }
        }
    }

    refreshBody()

    const entities: Ref<(Category | Term)[]> = ref<(Category | Term)[]>([])
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
                    : qualifiedName.value
                        ? true
                        : false,
            revalidateOnFocus: false,
        },
    })
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
        fetchAssets,
        fetchAssetsPaginated,
        deleteEntityFromList,
    }
}
