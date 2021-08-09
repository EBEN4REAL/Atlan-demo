import { ref } from 'vue';

import { useAPI } from "~/api/useAPI"
import { UPDATE_GLOSSARY, UPDATE_GLOSSARY_CATEGORY, UPDATE_GLOSSARY_TERM } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";



const useUpdateGtcEntity = (type: 'glossary' | 'category' | 'term') => {
    const keyMap = {
        glossary: UPDATE_GLOSSARY,
        category: UPDATE_GLOSSARY_CATEGORY,
        term: UPDATE_GLOSSARY_TERM,
    }

    const entityGuid = ref<string>();
    const entityType = ref<'glossary' | 'category' | 'term'>(type)
    const pathObject = ref({
        guid: entityGuid
    })
    const updateBody = ref()

    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossary | Components.Schemas.AtlasGlossary>(keyMap[entityType.value], 'PUT', {
        cache: true,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        body: updateBody,
        options: {
            revalidateOnFocus: false
        }
    })

    const updateEntity = (guid: string, body: any) => {
        entityGuid.value = guid;
        pathObject.value = { guid };
        updateBody.value = body;

        mutate()
    }


    return { data, error, isLoading, updateEntity }
}

export default useUpdateGtcEntity;