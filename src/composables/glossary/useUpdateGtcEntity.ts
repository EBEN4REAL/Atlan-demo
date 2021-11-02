import { ref, watch } from 'vue'

import { Entity } from '~/services/meta/entity'
import { Components } from '~/types/atlas/client'

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
        } = Entity.BulkUpdate<any>({
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
