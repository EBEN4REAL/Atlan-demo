import { computed, ComputedRef, Ref, ref } from 'vue';
import { Components } from '~/api/atlas/client';
import { Search } from '~/api/atlas/search';

import { BaseAttributes, BotsAttributes } from '~/constant/projection';
import { BotsType } from '~/types/atlas/bots';
import swrvState from '../utils/swrvState';



export default function fetchBotsList(filters?: Components.Schemas.FilterCriteria, limit?: number, offset?: number) {

    const body: Ref<Components.Schemas.SearchParameters> = ref({
        typeName: "Bot",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit: limit,
        offset: offset,
        attributes: [...BaseAttributes, ...BotsAttributes],
        query: "",
        entityFilters: filters,
    });
    const { response, error, mutate, isValidating } = Search.BasicSearch(body.value, {}, {
        revalidateOnFocus: false,
        dedupingInterval: 1,
    });

    const { state, STATES } = swrvState(response, error, isValidating)

    const list: ComputedRef<BotsType[] | undefined> = computed(() => {
        return <BotsType[] | undefined>response.value?.entities;
    });
    const totalCount = computed(() => {
        return response.value?.approximateCount;
    })
    const listCount = computed(() => {
        return response?.value?.entities?.length;
    });
    return {
        body,
        list,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate
    }
}
