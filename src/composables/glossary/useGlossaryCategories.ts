import { ref, Ref, watch } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GLOSSARY_CATEGORIES } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";

interface pathVariables {
    guid?: string;
    offset?: number;
    limit?: number;
    searchText?: string;
}

/**
 * Fetches the Categories of a particular Glossary
 */
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
    })

    watch(data, (newData) => {
        // Watch for new data and append it to the categories, if it does not already exist in the array
        if (newData?.length){
            categories.value = categories.value.map(category => {
                const newTerm = newData.find((entity) => category.guid === entity.guid)
                if(newTerm) return newTerm
                return category;
            })            
            newData.forEach((entity) => {
                if(!categories.value.find((category) => category.guid === entity.guid)){
                    categories.value.push(entity)
                }
            })

        }
    })

    /**
     * Fetches the first `limit` Categories of a glossary, without pagination
     * @param guid guid of parent Glossary
     * @param limit The number of Categories to fetch
     */
    const fetchGlossaryCategories = (guid: string, limit?: number) => {
        entityGuid.value = guid;
        pathObject.value = { guid, limit };

        mutate()
    }

    /**
     * Fetch the categories of a Glossary using pagination
     * @param [guid] guid of the parent Glossary. Leave blank to fetch next set of categories of the same glossary
     * @param [offset] paginaion offset, leave blank to fetch the next set - is updated automatically
     * @param [limit] The number of categories to fetch. `Default - 20`
     * @param [refreshSamePage] Refresh the same set
     */
    const fetchGlossaryCategoriesPaginated = ({ guid, offset, limit, refreshSamePage, searchText }: { guid?: string, offset?: number, limit?: number, searchText?: string, refreshSamePage?: boolean }) => {
        if(guid) { 
            categories.value = [];
            requestOffset.value = 0;
            entityGuid.value = guid;
        }
        if (offset || offset === 0) requestOffset.value = offset;
        if (refreshSamePage) requestOffset.value -= limit ?? defaultLimit;

        pathObject.value = {
            guid: guid ??  entityGuid.value,
            offset: requestOffset.value,
            limit: limit ?? defaultLimit,
            searchText: searchText ?? ''
        };

        mutate();

        requestOffset.value += limit ?? defaultLimit;
    }

    return { categories, error, isLoading, fetchGlossaryCategories, fetchGlossaryCategoriesPaginated }
}

export default useGlossaryCategories;