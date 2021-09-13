import { ref, Ref, watch } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GLOSSARY_TERMS } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";

interface pathVariables {
    guid?: string;
    offset?: number;
    limit?: number;
}

/**
 * Fetches the Terms of a particular Glossary
 */
const useGlossaryTerms = () => {
    const entityGuid = ref<string>();
    const requestOffset = ref(0);
    const defaultLimit = 20;

    const pathObject: Ref<pathVariables> = ref({
        guid: entityGuid.value
    })

    const terms: Ref<Components.Schemas.AtlasGlossaryTerm[]> = ref([]);

    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossaryTerm[]>(GET_GLOSSARY_TERMS, 'GET', {
        cache: true,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        options: {
            revalidateOnFocus: false,
        }
    })

    watch(data, (newData) => {
        // Watch for new data and append it to the Terms, if it does not already exist in the array
        if (newData?.length) {
            terms.value = terms.value.map(term => {
                const newTerm = newData.find((entity) => term.guid === entity.guid)
                if(newTerm) return newTerm
                return term;
            })
            newData.forEach((entity) => {
                if (!terms.value.find((term) => term.guid === entity.guid)) {
                    terms.value.push(entity)
                }
            })
        }
    })

    /**
     * Fetches the first `limit` Terms of a glossary, without pagination
     * @param guid guid of parent Glossary
     * @param limit The number of Terms to fetch
     */
    const fetchGlossaryTerms = (guid: string, limit?: number) => {
        entityGuid.value = guid;
        pathObject.value = { guid, limit };

        mutate()
    }

    /**
     * Fetch the Terms of a Glossary using pagination
     * @param [guid] guid of the parent Glossary. Leave blank to fetch next set of categories of the same glossary
     * @param [offset] paginaion offset, leave blank to fetch the next set - is updated automatically
     * @param [limit] The number of categories to fetch. `Default - 20`
     * @param [refreshSamePage] Refresh the same set
     */
    const fetchGlossaryTermsPaginated = ({ guid, offset, limit, refreshSamePage }: { guid?: string, offset?: number, limit?: number, refreshSamePage?: boolean }) => {
        if (guid){ 
            terms.value = [];
            requestOffset.value = 0;
            entityGuid.value = guid;
        }

        if (offset || offset === 0) requestOffset.value = offset;
        if (refreshSamePage) requestOffset.value -= limit ?? defaultLimit;

        pathObject.value = {
            guid: guid ??  entityGuid.value,
            offset: requestOffset.value,
            limit: limit ?? defaultLimit
        };

        mutate();

        requestOffset.value += limit ?? defaultLimit;
    }


    return { terms, error, isLoading, fetchGlossaryTerms, fetchGlossaryTermsPaginated }
}

export default useGlossaryTerms;