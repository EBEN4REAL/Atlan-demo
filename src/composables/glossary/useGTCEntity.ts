import { watch, ref, Ref, computed, WritableComputedRef } from 'vue'

import useIndexSearch from '~/composables/discovery/useIndexSearch'

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'

// import { projection } from '~/api/atlas/utils'
import { InternalAttributes, AssetAttributes } from '~/constant/projection'
// import { List as StatusList } from '~/constant/status'
// import useBusinessMetadataStore from '~/store/businessMetadata'

interface parameters {
    type:
    | 'glossary'
    | 'category'
    | 'term'
    | Ref<'glossary' | 'category' | 'term'>,
    entityGuid: Ref<string>,
    cache?: boolean,
    watchForGuidChange: boolean
}

/*
 * Uses the Atlas API to fetch a Glossary / Category / Term depending on
 * the type
 */
const useGTCEntity = <T extends Glossary | Category | Term>({
    type,
    entityGuid,
    cache,
    watchForGuidChange,
}: parameters) => {
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
    // const bmProjection = computed(
    //     () => useBusinessMetadataStore().getBusinessMetadataListProjections
    // )

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
            // ...projection,
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
            // ...bmProjection.value,
            ...relatedTerms,
            ...InternalAttributes,
            ...AssetAttributes,
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
    } = useIndexSearch<Glossary | Term | Category>(body, entityGuid, cache)

    const entity = ref<Glossary | Term | Category>()

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
    // const statusObject = computed(() =>
    //     StatusList.find(
    //         (status) =>
    //             status.id === entity.value?.attributes?.certificateStatus
    //     )
    // )
    const parentGlossaryGuid = ref<string>('')
    const parentGlossaryQualifiedName = ref<string>('')
    const parentGlossaryTitle = ref<string>('')


    watch(entityGuid, (newGuid) => {
        if (watchForGuidChange) {
            body.value = getBody()
            mutate()
        }
    })
    watch(data, (newData) => {
        entity.value = newData?.entities ? (newData.entities[0] as T) : undefined
    })
    watch(entity, (newEntity) => {
        if (newEntity) {
            if (newEntity.typeName === 'AtlasGlossary') {
                parentGlossaryGuid.value = newEntity.guid
                parentGlossaryQualifiedName.value = newEntity.attributes?.qualifiedName
                parentGlossaryTitle.value = newEntity.attributes?.name
            }
            else {
                parentGlossaryGuid.value = newEntity.attributes?.anchor?.guid
                parentGlossaryQualifiedName.value = newEntity.attributes?.anchor?.uniqueAttributes?.qualifiedName
                parentGlossaryTitle.value = newEntity.attributes?.anchor?.attributes?.name
            }
        }
    })

    const refetch = () => {
        body.value = getBody()
        mutate()
    }

    return {
        entity,
        title,
        shortDescription,
        qualifiedName,
        // statusObject,
        error,
        isLoading,
        refetch,
        mutate,
        statusMessage,
        parentGlossaryGuid,
        parentGlossaryQualifiedName,
        parentGlossaryTitle
    }
}

export default useGTCEntity
