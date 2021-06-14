import { computed, ComputedRef, Ref, ref } from 'vue';
import { Components } from '~/api/atlas/client';
import { BaseAttributes, BotsAttributes } from '~/constant/projection';
import { BotsType } from '~/types/atlas/bots';
import fetchSearchList from '../utils/search';

export default function fetchBotsList(dependent: any, query?: string, filters?: Components.Schemas.FilterCriteria, limit?: number, offset?: number) {

    const body: Ref<Components.Schemas.SearchParameters> = ref({
        typeName: "Bot",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit: limit,
        offset: offset,
        attributes: [...BaseAttributes, ...BotsAttributes],
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

    const list: ComputedRef<BotsType[] | undefined> = computed(() => {
        console.log(data);
        return <BotsType[] | undefined>data.value?.entities;
    });
    const item: ComputedRef<BotsType | undefined> = computed(() => {
        if (list.value) {
            if (list.value.length > 0) {
                return list.value[0];
            }
        }
        return {} as BotsType;
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