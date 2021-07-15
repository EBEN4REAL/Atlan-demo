import { ref } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GLOSSARY, GET_CATEGORY, GET_TERM } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";


const useGTCEntity = (type: 'glossary' | 'category' | 'term') => {
    const keyMap = {
        glossary: GET_GLOSSARY,
        category: GET_CATEGORY,
        term: GET_TERM,
    }

    const entityGuid = ref<string>();
    const entityType = ref<'glossary' | 'category' | 'term'>(type)
    const pathObject = ref({
        guid: entityGuid
    })

    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossary>(keyMap[entityType.value], 'GET', {
        cache: true,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        // url
    })

    const fetchEntity = (guid: string) => {
        entityGuid.value = guid;
        pathObject.value = { guid };

        mutate()
    }


    return { data, error, isLoading, fetchEntity }
}

export default useGTCEntity;