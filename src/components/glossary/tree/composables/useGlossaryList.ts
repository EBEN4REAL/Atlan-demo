import { watch, ref, Ref, computed } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import { GLOSSARY_LIST } from '~/api/keyMaps/glossary'
import { Glossary } from '~/types/glossary/glossary.interface'

import { projection } from '~/api/atlas/utils'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'

const useGlossaryList = (isHome?: Ref<boolean>) => {
    const body = ref({})

    const getBody = () => ({
        typeName: 'AtlasGlossary',
        excludeDeletedEntities: false,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        attributes: [
            ...projection,
            'metadata',
            'certificateStatus',
            'shortDescription',
            'parentCategory',
            'categories',
            'terms',
            'tenantId',
            ...BaseAttributes,
            ...BasicSearchAttributes,
        ],
    })

    body.value = getBody()
    const {
        data,
        error,
        isValidating: isLoading,
        mutate,
    } = useAPI<any>(GLOSSARY_LIST, 'POST', {
        cache: true,
        dependantFetchingKey: isHome,
        body,
        options: {
            revalidateOnFocus: false,
        },
    })

    const glossaryList = computed(() =>
        data.value?.entities ? (data.value?.entities as Glossary[]) : undefined
    )

    const refetch = () => {
        body.value = getBody()
        mutate()
    }

    return { glossaryList, error, isLoading, refetch }
}

export default useGlossaryList
