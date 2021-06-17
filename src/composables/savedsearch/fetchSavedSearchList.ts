import { computed, ComputedRef, Ref, ref } from 'vue';
import { Components } from '~/api/atlas/client';
import { BaseAttributes, SavedSearchAttribute } from '~/constant/projection';
import { BotsType } from '~/types/atlas/bots';
import fetchSearchList from '../utils/search';

export default function fetchSavedSearchList(dependent: any, query?: string, filters?: Components.Schemas.FilterCriteria, limit?: number, offset?: number) {

    const body: Ref<Components.Schemas.SearchParameters> = ref({
        typeName: "__AtlasUserSavedSearch",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit: limit,
        offset: offset,
        attributes: [...BaseAttributes, ...SavedSearchAttribute],
        query: query,
        entityFilters: filters,
    });

    const { data,
        totalCount,
        list,
        listCount,
        error,
        state,
        STATES,
        errorMessage,
        mutate } = fetchSearchList(dependent, body)



    return {
        data,
        body,
        list,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        errorMessage,
        mutate
    }
}