import { ref } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GLOSSARY_TERMS } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";


const useGlossaryTerms = () => {
    const entityGuid = ref<string>();

    const pathObject = ref({
        guid: entityGuid
    })

    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossaryTerm[]>(GET_GLOSSARY_TERMS, 'GET', {
        cache: true,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        // url
    })

    const fetchGlossaryTerms = (guid: string) => {
        entityGuid.value = guid;
        pathObject.value = { guid };

        mutate()
    }


    return { data, error, isLoading, fetchGlossaryTerms }
}

export default useGlossaryTerms;