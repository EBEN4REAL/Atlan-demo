import { computed, ComputedRef, ref, Ref, toRefs, watch } from 'vue';
import { Components } from '~/api/atlas/client';
import { Glossary } from '~/api/atlas/glossary'
import { Search } from '~/api/atlas/search';
import { useAPI } from '~/api/useAPI';

import BasicSearch from '~/composables/common/basicsearch';
import { BaseAttributes, GlossaryAttributes } from '~/constant/projection';
import { GlossaryType } from '~/types/atlas/glossary';


export default function fetchGlossaryList(query?: string, filters?: Components.Schemas.FilterCriteria, limit?: number, offset?: number) {

    const body: Components.Schemas.SearchParameters = {
        typeName: "AtlasGlossary",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit: limit,
        offset: offset,
        attributes: [...BaseAttributes, ...GlossaryAttributes],
        query: query,
        entityFilters: filters,
    };
    const { response, error, loading, mutate } = Search.BasicSearch(body, {}, {
        revalidateOnFocus: false
    });

    const list: ComputedRef<GlossaryType[] | undefined> = computed(() => {
        return response.value?.entities;
    })
    const totalCount = computed(() => {
        return response.value?.approximateCount;
    })
    const listCount = computed(() => {
        return response?.value?.entities?.length;
    })

    const refetchGlossary = () => {
        const { data, error, isLoading } = useAPI<Components.Schemas.AtlasSearchResult>('GLOSSARY_BASIC_SEARCH', 'POST', { cache: false, body })
        watch([data, error, isLoading], ([newData, newError, newLoading]) => {
            if(newData){
                response.value = newData ;
            }
            // error.value = newError;
            // loading.value = newLoading;
        });
    }

    return {
        response,
        list,
        totalCount,
        listCount,
        error,
        loading,
        mutate,
        refetchGlossary
    }
}