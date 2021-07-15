import { ref } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GLOSSARY, GET_CATEGORY, GET_TERM } from "~/api/keyMaps/glossary"


const useGTCEntity = () => {
    const keyMap = {
        glossary: GET_GLOSSARY,
        category: GET_CATEGORY,
        term: GET_TERM,
    }

    const entityGuid = ref<string>();
    const entityType = ref<'glossary' | 'category' | 'term'>('glossary')
    const pathObject = ref({
        guid: entityGuid
    })

    const { data, error, isLoading, mutate } = useAPI(keyMap[entityType.value], 'GET', {
        cache: entityGuid.value,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        // url
        })

    const fetchEntity = (type: 'glossary' | 'category' | 'term', guid: string)  => {
        entityGuid.value = guid;
        entityType.value = type;
        pathObject.value = {guid};

        mutate()
    }


    return { data, error, isLoading,  fetchEntity }
}

export default useGTCEntity;