import { watch, ref, Ref, computed } from 'vue'

import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { Glossary } from '~/types/glossary/glossary.interface'

import { InternalAttributes, AssetAttributes } from '~/constant/projection'

const useGlossaryList = (isHome?: Ref<boolean>) => {
    const body = ref({})

    const getBody = () => ({
        dsl: {
            size: 50,
            query: {
                term: {
                    "__typeName.keyword": "AtlasGlossary"
                }
            }
        },
        attributes: [
            'metadata',
            'certificateStatus',
            'shortDescription',
            'parentCategory',
            'categories',
            'terms',
            'tenantId',
            ...InternalAttributes,
            ...AssetAttributes,
        ],
    })

    body.value = getBody()
    const {
        data,
        error,
        isValidating: isLoading,
        mutate,
    } =  useIndexSearch<Glossary>(body, ref(true), true)
    
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
