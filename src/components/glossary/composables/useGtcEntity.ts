import { watch, ref, Ref, computed, isRef, WritableComputedRef } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import { GET_GTC_ENTITY } from '~/api/keyMaps/glossary'
import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'
import { Components } from '~/api/atlas/client'

import { projection } from '~/api/atlas/utils'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'
import { List as StatusList } from '~/constant/status'
import useBusinessMetadataStore from '~/store/businessMetadata'

/*
 * Uses the Atlas API to fetch a Glossary / Category / Term depending on
 * the type
 */
const useGTCEntity = <T extends Glossary | Category | Term>(
    type:
        | 'glossary'
        | 'category'
        | 'term'
        | Ref<'glossary' | 'category' | 'term'>,
    entityGuid: Ref<string>,
    cache?: boolean | string,
    watchForGuidChange: boolean = true
) => {
    console.log('useGtcEntity called')
    const body = ref({})

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

    const getBody = () => ({
        dsl: {
            size: 10,
            query: {
                term: {
                    __guid: entityGuid.value ?? '',
                },
            },
        },
        attributes: [
            ...projection,
            'assignedEntities',
            'atlanSchema',
            'metadata',
            'certificateStatus',
            'shortDescription',
            'parentCategory',
            'categories',
            'childrenCategories',
            'terms',
            'tenantId',
            'anchor',
            'linkedAssets',
            'readme',
            'bannerDescription',
            'bannerTitle',
            'bannerType',
            'bannerUpdatedAt',
            'bannerUpdatedBy',
            ...bmProjection.value,
            ...relatedTerms,
            ...BaseAttributes,
            ...BasicSearchAttributes,
        ],
        relationAttributes: [
            'readme',
            'displayText',
            'name',
            'description',
            'shortDescription',
        ],
    })

    body.value = getBody()
    const {
        data,
        error,
        isValidating: isLoading,
        mutate,
    } = useAPI<any>(GET_GTC_ENTITY, 'POST', {
        cache: cache ?? true,
        dependantFetchingKey: entityGuid,
        body,
        options: {
            revalidateOnFocus: false,
        },
    })

    const entity = computed(() =>
        data.value?.entities ? (data.value?.entities[0] as T) : undefined
    )

    const referredEntities = computed(
        () =>
            data.value?.referredEntities as Record<
                string,
                Components.Schemas.AtlasEntityHeader
            >
    )
    const title: WritableComputedRef<string | undefined> = computed({
        get: () => entity.value?.attributes?.name ?? '',
        set: (val: string) => {
            if (entity.value) entity.value.attributes.name = val
        },
    })
    const shortDescription = computed(
        () => entity.value?.attributes?.shortDescription
    )
    const qualifiedName = computed(
        () => entity.value?.attributes?.qualifiedName ?? ''
    )
    const statusMessage = computed(
        () => entity.value?.attributes?.assetStatusMessage ?? ''
    )

    const statusObject = computed(() =>
        StatusList.find(
            (status) =>
                status.id === entity.value?.attributes?.certificateStatus
        )
    )

    watch(entityGuid, (newGuid) => {
        if (watchForGuidChange) {
            body.value = getBody()
            mutate()
        }
    })

    const refetch = () => {
        body.value = getBody()
        mutate()
        console.log('refetching')
        console.log(entity)
    }

    return {
        entity,
        referredEntities,
        title,
        shortDescription,
        qualifiedName,
        statusObject,
        error,
        isLoading,
        refetch,
        mutate,
        statusMessage,
    }
}

export default useGTCEntity
