import { ref, watch, inject } from 'vue'

import { useAPI } from '~/api/useAPI'
import {
    UPDATE_GLOSSARY,
    UPDATE_GLOSSARY_CATEGORY,
    UPDATE_GLOSSARY_TERM,
} from '~/api/keyMaps/glossary'
import { Components } from '~/api/atlas/client'

const useUpdateGtcEntity = () => {
    const keyMap = {
        glossary: UPDATE_GLOSSARY,
        category: UPDATE_GLOSSARY_CATEGORY,
        term: UPDATE_GLOSSARY_TERM,
    }

    const data = ref<
        | Components.Schemas.AtlasGlossary
        | Components.Schemas.AtlasGlossaryCategory
        | Components.Schemas.AtlasGlossaryTerm
    >()
    const error = ref<any>()
    const isUpdating = ref<boolean>()

    const updateTreeNode = inject<any>('updateTreeNode')

    const updateEntity = (
        entityType: 'glossary' | 'category' | 'term',
        guid: string,
        body: any,
        updateTree?: boolean
    ) => {
        const {
            data: updateData,
            error: updateError,
            isLoading,
        } = useAPI<
            | Components.Schemas.AtlasGlossary
            | Components.Schemas.AtlasGlossaryCategory
            | Components.Schemas.AtlasGlossaryTerm
        >(keyMap[entityType], 'PUT', {
            cache: false,
            pathVariables: {
                guid,
            },
            body,
            options: {
                revalidateOnFocus: false,
            },
        })

        watch(updateData, (newData) => {
            data.value = newData
            if (newData) {
                if (updateTreeNode && (updateTree ?? true)) {
                    updateTreeNode({
                        guid: newData.guid,
                        name: newData.name,
                        certificateStatus:
                            newData.certificateStatus ?? 'is_null',
                    })
                }
            }
        })
        watch(updateError, (newError) => {
            error.value = newError
        })
        watch(isLoading, (loading) => {
            isUpdating.value = loading
        })
    }

    return { data, error, isUpdating, updateEntity }
}

export default useUpdateGtcEntity
