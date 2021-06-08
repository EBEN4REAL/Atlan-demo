import { computed, ComputedRef, ref, Ref, toRefs, watch } from 'vue';
import { Components } from '~/api/atlas/client';
import { Glossary } from '~/api/atlas/glossary'
import { Search } from '~/api/atlas/search';

import BasicSearch from '~/composables/common/basicsearch';
import { BaseAttributes, GlossaryAttributes } from '~/constant/projection';
import { GlossaryType } from '~/types/atlas/glossary';


export default function fetchGlossaryList(filters?: Components.Schemas.FilterCriteria, query?: string, limit?: number, offset?: number) {

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

    return {
        list,
        totalCount,
        listCount,
        error,
        loading,
        mutate
    }
}