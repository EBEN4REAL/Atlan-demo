import { ref } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GLOSSARY_CATEGORIES } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";


const useGlossaryCategories = () => {
    const entityGuid = ref<string>();

    const pathObject = ref({
        guid: entityGuid
    })

    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossaryCategory[]>(GET_GLOSSARY_CATEGORIES, 'GET', {
        cache: true,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        // url
    })

    const fetchGlossaryCategories = (guid: string) => {
        entityGuid.value = guid;
        pathObject.value = { guid };

        mutate()
    }


    return { data, error, isLoading, fetchGlossaryCategories }
}

export default useGlossaryCategories;