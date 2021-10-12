import { ref } from 'vue'
import { useAPI } from '~/api/useAPI'

import {
    GET_TERM_LINKED_ASSETS,
    ASSIGN_TERM_LINKED_ASSETS,
} from '~/api/keyMaps/glossary'

import { projection } from '~/api/atlas/utils'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'

import { Components } from '~/api/atlas/client'

export default function useTermLinkedAssets() {
    const termQualifiedName = ref<string>()
    const requestQuery = ref<string>()
    const body = ref()

    const getBody = () => ({
        termName: termQualifiedName.value,
        typeName: 'AtlanAsset',
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        attributes: [
            ...projection,
            'atlanSchema',
            'certificateStatus',
            ...BaseAttributes,
            ...BasicSearchAttributes,
        ],
        query: requestQuery.value,
    })

    const {
        data: linkedAssets,
        error,
        isLoading,
        mutate,
    } = useAPI<Components.Schemas.AtlasSearchResult>(
        GET_TERM_LINKED_ASSETS,
        'POST',
        {
            cache: false,
            body,
            dependantFetchingKey: termQualifiedName,
            options: {
                revalidateOnFocus: false,
            },
        }
    )

    const fetchLinkedAssets = (termName: string, query?: string) => {
        termQualifiedName.value = termName
        requestQuery.value = query ?? ''

        body.value = getBody()

        if (termName || query) mutate()
    }

    return {
        linkedAssets,
        error,
        isLoading,
        fetchLinkedAssets,
    }
}
