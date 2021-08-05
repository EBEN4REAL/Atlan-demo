import { computed, ComputedRef, Ref, ref } from 'vue';
import { Components } from '~/api/atlas/client';
import { BaseAttributes, JobsAttributes } from '~/constant/projection';
import { BotsType } from '~/types/atlas/bots';
import fetchSearchList from '../utils/search';

export default function fetchJobList(dependent: any, query?: string, filters?: any, limit?: number, offset?: number) {

    const body: Ref<Components.Schemas.SearchParameters> = ref({
        typeName: "Job",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit,
        offset,
        attributes: [...BaseAttributes, ...JobsAttributes],
        query,
        entityFilters: filters,
    });

    const { data,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        errorMessage,
        mutate } = fetchSearchList(dependent, body)

    const list: ComputedRef<any[] | undefined> = computed(() => <any[] | undefined>data.value?.entities);
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
        errorMessage,
        mutate
    }
}