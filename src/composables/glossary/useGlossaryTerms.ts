import { ref, Ref, watch } from 'vue';

import { useAPI } from "~/api/useAPI"
import { GET_GLOSSARY_TERMS } from "~/api/keyMaps/glossary"
import { Components } from "~/api/atlas/client";

interface pathVariables {
    guid?: string;
    offset?: number;
    limit?: number;
}

const useGlossaryTerms = () => {
    const entityGuid = ref<string>();
    const requestOffset = ref(0);
    const defaultLimit = 20;

    const pathObject: Ref<pathVariables> = ref({
        guid: entityGuid
    })

    const terms: Ref<Components.Schemas.AtlasGlossaryTerm[]> = ref([]);

    const { data, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasGlossaryTerm[]>(GET_GLOSSARY_TERMS, 'GET', {
        cache: true,
        dependantFetchingKey: entityGuid,
        pathVariables: pathObject,
        // url
    })

    watch(data, (newData) => {
        if (newData?.length)
            terms.value = [...terms.value, ...newData]
    })

    const fetchGlossaryTerms = (guid: string, limit?: number) => {
        entityGuid.value = guid;
        pathObject.value = { guid, limit };

        mutate()
    }

    const fetchGlossaryTermsPaginated = ({ guid, offset, limit, refreshSamePage }: { guid: string, offset?: number, limit?: number, refreshSamePage?: boolean }) => {
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


    return { data, error, isLoading, fetchGlossaryTerms, fetchGlossaryTermsPaginated }
}

export default useGlossaryTerms;