import { Ref, ref } from 'vue';
import { Components } from '~/api/atlas/client';
import { BaseAttributes, CredentialAttributes } from '~/constant/projection';
import fetchSearchList from '../utils/search';

export default function fetchConnectionList(dependent: any, query?: string, filters?: Components.Schemas.FilterCriteria, limit?: number, offset?: number) {

    const body: Ref<Components.Schemas.SearchParameters> = ref({
        typeName: "Credential",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit: limit,
        offset: offset,
        attributes: [...BaseAttributes, ...CredentialAttributes],
        query: query,
        entityFilters: filters,
    });

    const { data,
        list,
        item,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate } = fetchSearchList(dependent, body)

    return {
        data,
        body,
        list,
        item,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate
    }
}