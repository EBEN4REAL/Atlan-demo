import { ref, Ref, watch } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GLOSSARY_CATEGORIES } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";

interface pathVariables {
    guid?: string;
    offset?: number;
    limit?: number;
}

const useGlossaryCategories = () => {
    const entityGuid = ref<string>();
    const requestOffset = ref(0);
    const defaultLimit = 20;

    const pathObject: Ref<pathVariables> = ref({
        guid: entityGuid
    })

    const categories: Ref<Components.Schemas.AtlasGlossaryCategory[]> = ref([]);

    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossaryCategory[]>(GET_GLOSSARY_CATEGORIES, 'GET', {
        cache: true,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        options: {
            revalidateOnFocus: false,
        }
        // url
    })

    watch(data, (newData) => {
        if (newData?.length){
            categories.value = [...categories.value];
            newData.forEach((entity) => {
                if(!categories.value.find((category) => category.guid === entity.guid)){
                    categories.value.push(entity)
                }
            })

        }
    })

    const fetchGlossaryCategories = (guid: string, limit?: number) => {
        entityGuid.value = guid;
        pathObject.value = { guid, limit };

        mutate()
    }



    const fetchGlossaryCategoriesPaginated = ({ guid, offset, limit, refreshSamePage }: { guid?: string, offset?: number, limit?: number, refreshSamePage?: boolean }) => {
        if(guid) categories.value = [];
        entityGuid.value = guid;

        if (offset) requestOffset.value = offset;
        if (refreshSamePage) requestOffset.value -= limit ?? defaultLimit;

        pathObject.value = {
            guid,
            offset: requestOffset.value,
            limit: limit ?? defaultLimit
        };

        mutate();

        requestOffset.value += limit ?? defaultLimit;
    }

    return { categories, error, isLoading, fetchGlossaryCategories, fetchGlossaryCategoriesPaginated }
}

export default useGlossaryCategories;