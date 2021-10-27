import { ref, watch } from 'vue'

import { useAPI } from '~/services/api/useAPI'
import {
    UPDATE_GLOSSARY,
    UPDATE_GLOSSARY_CATEGORY,
    UPDATE_GLOSSARY_TERM,
} from '~/api/keyMaps/glossary'
import { Components } from '~/api/atlas/client'

interface params {
    typeName: 'AtlasGlossary' | 'AtlasGlossaryTerm' | 'AtlasGlossaryCategory'
    qualifiedName: string
    name: string
    anchor?: {
        guid: string;
        typeName: string;
        uniqueAttributes: Record<string, any>
    }
    updates: Record<string, any>
}

const useUpdateGtcEntity = () => {
    const keyMap = {
        AtlasGlossary: UPDATE_GLOSSARY,
        AtlasGlossaryTerm: UPDATE_GLOSSARY_CATEGORY,
        AtlasGlossaryCategory: UPDATE_GLOSSARY_TERM,
    }

    const data = ref<
        | Components.Schemas.AtlasGlossary
        | Components.Schemas.AtlasGlossaryCategory
        | Components.Schemas.AtlasGlossaryTerm
    >()
    const error = ref<any>()
    const isUpdating = ref<boolean>()

    const updateEntity = ({
        typeName,
        qualifiedName,
        name,
        anchor,
        updates
    }: params) => {
        const {
            data:updateData,
            error: updateError,
            isLoading,
        } = useAPI(keyMap[typeName], 'POST', {
            cache: false,
            body: {
                entities: [
                    {
                        typeName,
                        attributes: {
                            name,
                            ...updates,
                            anchor,
                            qualifiedName
                        }        
                    }
                ]
            },
            options: {
                revalidateOnFocus: false,
            },
        })
        watch(updateData, (newData) => {
            data.value = newData
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
