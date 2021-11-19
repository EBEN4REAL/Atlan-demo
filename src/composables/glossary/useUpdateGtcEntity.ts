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

const useUpdateGtcEntity = ({
    typeName,
    qualifiedName,
    name,
    anchor,
    updates
}: params) => {

    const {
        data,
        error,
        isLoading: isUpdating,
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

    return { data, error, isUpdating }
}

export default useUpdateGtcEntity
