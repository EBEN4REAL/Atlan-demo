import { ref } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_CATEGORY_TERMS } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";


const useGlossaryTerms = () => {
    const entityGuid = ref<string>();

    const pathObject = ref({
        guid: entityGuid
    })

    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossaryTerm[]>(GET_CATEGORY_TERMS, 'GET', {
        cache: true,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        // url
    })

    const fetchCategoryTerms = (guid: string) => {
        entityGuid.value = guid;
        pathObject.value = { guid };

        mutate()
    }


    return { data, error, isLoading, fetchCategoryTerms }
}

export default useGlossaryTerms;