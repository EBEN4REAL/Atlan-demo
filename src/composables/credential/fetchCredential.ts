import { computed, ComputedRef, Ref, ref } from 'vue';
import { Components } from '~/api/atlas/client';
import { BaseAttributes, CredentialAttributes } from '~/constant/projection';
import { CredentialType } from '~/types/atlas/credential';
import fetchSearchList from '../utils/search';

export default function fetchCredentialList(dependent: any, query?: string, filters?: Components.Schemas.FilterCriteria, limit?: number, offset?: number) {

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
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate } = fetchSearchList(dependent, body)

    const list: ComputedRef<CredentialType[] | undefined> = computed(() => {

        return <CredentialType[] | undefined>data.value?.entities;
    });
    const item: ComputedRef<CredentialType | undefined> = computed(() => {
        if (list.value) {
            if (list.value.length > 0) {
                return list.value[0];
            }
        }
        return {} as CredentialType;
    });


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