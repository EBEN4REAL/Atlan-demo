import { watch, ref, Ref, computed } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import { GLOSSARY_LIST } from '~/api/keyMaps/glossary'
import { Glossary } from '~/types/glossary/glossary.interface'

import { projection } from '~/api/atlas/utils'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'
import { BasicSearchResponse } from '~/types/insights/table.interface'

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
    } = useAPI<BasicSearchResponse<Glossary>>(GLOSSARY_LIST, 'POST', {
        cache: true,
        dependantFetchingKey: isHome,
        body,
        options: {
            revalidateOnFocus: false,
        },
    })

    const glossaryList = computed(() =>
        data.value?.entities ? (data.value?.entities ) : undefined
    )

    const refetch = () => {
        body.value = getBody()
        mutate()
    }
    const updateGlossaryStatusInList = (glossaryGuid: string, certificateStatus: "DRAFT" | "VERIFIED" | "ISSUE" | undefined) => {
        const index = data.value?.entities?.findIndex((glossary) => glossary.guid === glossaryGuid);
        if((index || index === 0) && data.value && data.value.entities && data.value.entities[index]) {
            data.value.entities[index].attributes.certificateStatus = certificateStatus;
        } 

    }

    return { glossaryList, error, isLoading, refetch, updateGlossaryStatusInList }
}

export default useGlossaryList
